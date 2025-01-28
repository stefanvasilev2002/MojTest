package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.*;
import com.finki.mojtest.model.dtos.MetadataDTO;
import com.finki.mojtest.model.dtos.QuestionDTO;
import com.finki.mojtest.model.dtos.QuestionFromTeacherDTO;
import com.finki.mojtest.model.enumerations.QuestionType;
import com.finki.mojtest.model.mappers.QuestionMapper;
import com.finki.mojtest.model.users.Teacher;
import com.finki.mojtest.model.users.User;
import com.finki.mojtest.repository.*;
import com.finki.mojtest.repository.users.TeacherRepository;
import com.finki.mojtest.repository.users.UserRepository;
import com.finki.mojtest.service.QuestionService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final TeacherRepository teacherRepository;
    private final MetadataRepository metadataRepository;
    private final TestRepository testRepository;
    private final UserRepository userRepository;
    private final StudentAnswerRepository studentAnswerRepository;
    private final TestQuestionRepository testQuestionRepository;
    private final FileRepository fileRepository;
    private final StudentTestRepository studentTestRepository;

    @Override
    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }

    @Override
    @Transactional
    public Question createQuestionByDTO(QuestionDTO questionDTO) {
        // Validate essential fields
        if (questionDTO.getCreatorId() == null) {
            throw new IllegalArgumentException("Creator ID must not be null");
        }

        // Find the teacher
        Teacher creator = (Teacher) userRepository.findById(questionDTO.getCreatorId())
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found with ID: " + questionDTO.getCreatorId()));

        // Create the question
        Question question = QuestionMapper.fromDTO(questionDTO);

        // Set default type if null
        if (question.getQuestionType() == null) {
            question.setQuestionType(QuestionType.MULTIPLE_CHOICE);
        }

        // Set the creator
        question.setCreator(creator);

        // Save the question first to get its ID
        question = questionRepository.save(question);

        // Create and save answers
        List<Answer> answers = new ArrayList<>();
        if (questionDTO.getAnswers() != null) {
            for (int i = 0; i < questionDTO.getAnswers().size(); i++) {
                var answerDTO = questionDTO.getAnswers().get(i);
                Answer answer = new Answer();
                answer.setAnswerText(answerDTO.getAnswerText());
                answer.setCorrect(question.getQuestionType() == QuestionType.MULTIPLE_CHOICE ?
                        answerDTO.isCorrect() : i == 0); // For non-MC questions, first answer is correct
                answer.setQuestion(question);
                answers.add(answerRepository.save(answer));
            }
        }

        // Set answers and save again
        question.setAnswers(answers);
        return questionRepository.save(question);
    }

    @Override
    public Question getQuestionById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
    }

    @Override
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    @Override
    @Transactional
    public Question updateQuestion(Long id, QuestionDTO questionDTO) {
        try {
            Question existingQuestion = getQuestionById(id);

            // Resolve related entities
            User creator = userRepository.findById(questionDTO.getCreatorId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));

            List<Test> tests = (questionDTO.getTestIds() != null && !questionDTO.getTestIds().isEmpty()) ?
                    testRepository.findAllById(questionDTO.getTestIds()) :
                    Collections.emptyList();
            File image = null;
            if(questionDTO.getFile() != null) {
                image=fileRepository.findById(questionDTO.getFile().getId()).orElse(null);
            }


            List<Metadata> metadata = new ArrayList<>();
            if (questionDTO.getMetadata() != null && !questionDTO.getMetadata().isEmpty()) {
                for (MetadataDTO metadataDTO : questionDTO.getMetadata()) {
                    Metadata existingMetadata = metadataRepository.findByKeyAndValue(metadataDTO.getKey(), metadataDTO.getValue())
                            .orElse(null);

                    if (existingMetadata != null) {
                        metadata.add(existingMetadata);
                    } else {
                        Metadata newMetadata = new Metadata();
                        newMetadata.setKey(metadataDTO.getKey());
                        newMetadata.setValue(metadataDTO.getValue());
                        metadata.add(metadataRepository.save(newMetadata));
                    }
                }
            }

            QuestionMapper.updateFromDTO(existingQuestion, questionDTO, creator, tests, metadata, new Date(), image);

            existingQuestion.setDescription(questionDTO.getDescription());

            if (questionDTO.getAnswers() != null) {
                try {
                    Question question = questionRepository.findById(id)
                            .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + id));

                    // 1. First find and delete all StudentAnswers that reference this question's TestQuestions
                    List<TestQuestion> testQuestions = testQuestionRepository.findByQuestionId(id);
                    List<StudentAnswer> studentAnswers = studentAnswerRepository.findAllByTestQuestionIn(testQuestions);
                    studentAnswerRepository.deleteAll(studentAnswers);

                    // 2. Delete the TestQuestion associations
                    testQuestionRepository.deleteTestQuestionsByQuestionId(id);

                    // 3. Remove the question from all tests it belongs to
                    question.getTests().forEach(test -> {
                        test.getQuestionBank().remove(question);
                        testRepository.save(test);
                    });

                    // 4. Delete all answers associated with the question
                    answerRepository.deleteAll(question.getAnswers());

                    // Create new answers
                    List<Answer> newAnswers = questionDTO.getAnswers().stream()
                            .map(answerDTO -> {
                                Answer answer = new Answer();
                                answer.setAnswerText(answerDTO.getAnswerText());
                                answer.setCorrect(answerDTO.isCorrect());
                                answer.setQuestion(existingQuestion);
                                return answer;
                            })
                            .collect(Collectors.toList());

                    existingQuestion.setAnswers(answerRepository.saveAll(newAnswers));
                } catch (DataIntegrityViolationException e) {
                    throw new IllegalStateException("Cannot modify answers because they are referenced by student answers", e);
                }
            }

            return questionRepository.save(existingQuestion);
        } catch (DataIntegrityViolationException e) {
            if (e.getMessage().contains("student_answer")) {
                throw new IllegalStateException("Cannot modify question because it has been used in student answers", e);
            }
            throw e;
        }
    }


    @Transactional
    public void deleteQuestion(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + id));

        // 1. First find and delete all StudentAnswers that reference this question's TestQuestions
        List<TestQuestion> testQuestions = testQuestionRepository.findByQuestionId(id);
        List<StudentAnswer> studentAnswers = studentAnswerRepository.findAllByTestQuestionIn(testQuestions);
        studentAnswerRepository.deleteAll(studentAnswers);

        // 2. Delete the TestQuestion associations
        testQuestionRepository.deleteTestQuestionsByQuestionId(id);

        // 3. Remove the question from all tests it belongs to
        question.getTests().forEach(test -> {
            test.getQuestionBank().remove(question);
            testRepository.save(test);
        });

        // 4. Delete all answers associated with the question
        answerRepository.deleteAll(question.getAnswers());

        // 5. Finally delete the question itself
        questionRepository.delete(question);
    }

    @Override
    public List<Question> getQuestionsByTestId(Long testId) {
        return questionRepository.findByTestId(testId);
    }

    @Override
    @Transactional
    public Question createAndAddQuestionToTest(Long testId, QuestionFromTeacherDTO questionCreateDTO) {
        if (questionCreateDTO.getCreatorId() == null) {
            throw new IllegalArgumentException("Creator ID must not be null");
        }

        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new EntityNotFoundException("Test not found with ID: " + testId));

        User creator = userRepository.findById(questionCreateDTO.getCreatorId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + questionCreateDTO.getCreatorId()));

        Question question = new Question();
        question.setQuestionType(questionCreateDTO.getType() != null ?
                QuestionType.valueOf(questionCreateDTO.getType()) :
                QuestionType.MULTIPLE_CHOICE);

        question.setDescription(questionCreateDTO.getDescription());
        question.setPoints(questionCreateDTO.getPoints());
        question.setNegativePointsPerAnswer(questionCreateDTO.getNegativePointsPerAnswer());
        question.setFormula(questionCreateDTO.getFormula());
        question.setHint(questionCreateDTO.getHint());
        question.setCreator(creator);
        question.setIsCopy(questionCreateDTO.getIsCopy());



        question = questionRepository.save(question);

        if(questionCreateDTO.getFile() != null) {
            Optional<File> image = fileRepository.findById(questionCreateDTO.getFile().getId());
            if(image.isPresent()) {
                Optional<Question> checkIfFileExist = questionRepository.findByImage_Id(questionCreateDTO.getFile().getId());
                if(checkIfFileExist.isPresent()) {
                    File imageFile = new File();
                    imageFile.setFileName(image.get().getFileName());
                    imageFile.setFilePath(image.get().getFilePath());
                    imageFile.setFileType(image.get().getFileType());
                    imageFile.setRelatedEntityId(question.getId());
                    imageFile.setUploadedAt(image.get().getUploadedAt());
                    imageFile = fileRepository.save(imageFile);
                    question.setImage(imageFile);
                }else{
                    question.setImage(image.get());
                }

            }
        }

        if (questionCreateDTO.getMetadata() != null) {
            Question finalQuestion = question;
            List<Metadata> metadataList = questionCreateDTO.getMetadata().stream()
                    .map(metadataDTO -> {
                        Metadata metadata = metadataRepository.findByKeyAndValue(metadataDTO.getKey(), metadataDTO.getValue())
                                .orElseGet(() -> {
                                    Metadata newMetadata = new Metadata();
                                    newMetadata.setKey(metadataDTO.getKey());
                                    newMetadata.setValue(metadataDTO.getValue());
                                    return metadataRepository.save(newMetadata);
                                });
                        metadata.getQuestions().add(finalQuestion);
                        return metadata;
                    })
                    .collect(Collectors.toList());

            question.setMetadata(metadataList);
        }

        if (questionCreateDTO.getAnswers() != null) {
            Question finalQuestion1 = question;
            List<Answer> answers = questionCreateDTO.getAnswers().stream()
                    .map(answerDTO -> {
                        Answer answer = new Answer();
                        answer.setAnswerText(answerDTO.getAnswerText());
                        answer.setCorrect(answerDTO.isCorrect());
                        answer.setQuestion(finalQuestion1);
                        answer.setCorrect(answerDTO.isCorrect());
                        return answerRepository.save(answer);
                    })
                    .collect(Collectors.toList());

            question.setAnswers(answers);
        }

        test.getQuestionBank().add(question);
        testRepository.save(test);

        return questionRepository.save(question);
    }

    @Override
    public List<Question> getQuestionsNotInTest(Long testId) {
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new EntityNotFoundException("Test not found with ID: " + testId));

        return questionRepository.findAllByTestsNotContaining(test);
    }

    @Override
    public Question createQuestionByDTOForFutureUse(QuestionFromTeacherDTO questionCreateDTO) {
        if (questionCreateDTO.getCreatorId() == null) {
            throw new IllegalArgumentException("Creator ID must not be null");
        }

        User creator = userRepository.findById(questionCreateDTO.getCreatorId())
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found with ID: " + questionCreateDTO.getCreatorId()));

        Question question = new Question();
        question.setQuestionType(questionCreateDTO.getType() != null ?
                QuestionType.valueOf(questionCreateDTO.getType()) :
                QuestionType.MULTIPLE_CHOICE);

        question.setDescription(questionCreateDTO.getDescription());
        question.setPoints(questionCreateDTO.getPoints());
        question.setNegativePointsPerAnswer(questionCreateDTO.getNegativePointsPerAnswer());
        question.setFormula(questionCreateDTO.getFormula());
        question.setHint(questionCreateDTO.getHint());
        question.setCreator(creator);
        question.setIsCopy(questionCreateDTO.getIsCopy());

        if(questionCreateDTO.getFile() != null) {
            Optional<File> image = fileRepository.findById(questionCreateDTO.getFile().getId());
            if(image.isPresent()) {
                question.setImage(image.get());
            }
        }

        question = questionRepository.save(question);

        if (questionCreateDTO.getMetadata() != null) {
            Question finalQuestion = question;
            List<Metadata> metadataList = questionCreateDTO.getMetadata().stream()
                    .map(metadataDTO -> {
                        Metadata metadata = metadataRepository.findByKeyAndValue(metadataDTO.getKey(), metadataDTO.getValue())
                                .orElseGet(() -> {
                                    Metadata newMetadata = new Metadata();
                                    newMetadata.setKey(metadataDTO.getKey());
                                    newMetadata.setValue(metadataDTO.getValue());
                                    return metadataRepository.save(newMetadata);
                                });
                        metadata.getQuestions().add(finalQuestion);
                        return metadata;
                    })
                    .collect(Collectors.toList());

            question.setMetadata(metadataList);
        }

        if (questionCreateDTO.getAnswers() != null) {
            Question finalQuestion1 = question;
            List<Answer> answers = questionCreateDTO.getAnswers().stream()
                    .map(answerDTO -> {
                        Answer answer = new Answer();
                        answer.setAnswerText(answerDTO.getAnswerText());
                        answer.setCorrect(answerDTO.isCorrect());
                        answer.setQuestion(finalQuestion1);
                        answer.setCorrect(answerDTO.isCorrect());
                        return answerRepository.save(answer);
                    })
                    .collect(Collectors.toList());

            question.setAnswers(answers);
        }

        return questionRepository.save(question);    }
}