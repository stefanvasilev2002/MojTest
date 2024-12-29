package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.*;
import com.finki.mojtest.model.dtos.MetadataDTO;
import com.finki.mojtest.model.dtos.QuestionDTO;
import com.finki.mojtest.model.dtos.QuestionFromTeacherDTO;
import com.finki.mojtest.model.enumerations.QuestionType;
import com.finki.mojtest.model.mappers.QuestionMapper;
import com.finki.mojtest.model.users.Teacher;
import com.finki.mojtest.repository.*;
import com.finki.mojtest.repository.users.TeacherRepository;
import com.finki.mojtest.repository.users.UserRepository;
import com.finki.mojtest.service.QuestionService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
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
        Question existingQuestion = getQuestionById(id);

        // Resolve related entities
        Teacher creator = teacherRepository.findById(questionDTO.getCreatorId())
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found"));

        List<Test> tests = (questionDTO.getTestIds() != null && !questionDTO.getTestIds().isEmpty()) ?
                testRepository.findAllById(questionDTO.getTestIds()) :
                Collections.emptyList();

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

        QuestionMapper.updateFromDTO(existingQuestion, questionDTO, creator, tests, metadata, new Date());
        existingQuestion.setDescription(questionDTO.getDescription());

        if (questionDTO.getAnswers() != null) {
            // Remove old answers
            answerRepository.deleteAll(existingQuestion.getAnswers());

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
        }

        return questionRepository.save(existingQuestion);
    }


    @Override
    @Transactional
    public void deleteQuestion(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + id));

        List<StudentAnswer> studentAnswers = studentAnswerRepository.findAllByChosenAnswerIn(question.getAnswers());
        studentAnswerRepository.deleteAll(studentAnswers);

        testQuestionRepository.deleteTestQuestionsByQuestionId(id);

        question.getTests().forEach(test -> {
            test.getQuestionBank().remove(question);
            testRepository.save(test);
        });

        answerRepository.deleteAll(question.getAnswers());

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

        Teacher creator = (Teacher) userRepository.findById(questionCreateDTO.getCreatorId())
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
}