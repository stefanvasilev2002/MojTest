package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.*;
import com.finki.mojtest.model.dtos.*;
import com.finki.mojtest.model.mappers.TestMapper;
import com.finki.mojtest.model.users.Student;
import com.finki.mojtest.model.users.Teacher;
import com.finki.mojtest.model.users.User;
import com.finki.mojtest.repository.*;
import com.finki.mojtest.repository.users.TeacherRepository;
import com.finki.mojtest.repository.users.UserRepository;
import com.finki.mojtest.service.TestService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestServiceImpl implements TestService {
    private final TestRepository testRepository;
    private final TeacherRepository teacherRepository;
    private final QuestionRepository questionRepository;
    private final MetadataRepository metadataRepository;
    private final StudentTestRepository studentTestRepository;
    private final TestQuestionRepository testQuestionRepository;
    private final StudentAnswerRepository studentAnswerRepository;
    private final UserRepository userRepository;

    @Transactional
    public Test addQuestionToTest(Long testId, Long questionId) {
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new EntityNotFoundException("Test not found with id: " + testId));

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + questionId));

        if (test.getQuestionBank().contains(question)) {
            throw new IllegalStateException("Question is already in the test");
        }

        test.getQuestionBank().add(question);

        return testRepository.save(test);
    }

    @Transactional
    public Test removeQuestionFromTest(Long testId, Long questionId) {
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new EntityNotFoundException("Test not found with id: " + testId));

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + questionId));

        if (!test.getQuestionBank().contains(question)) {
            throw new IllegalStateException("Question is not in the test");
        }

        test.getQuestionBank().remove(question);


        return testRepository.save(test);
    }

    @Override
    public Test updateTestFromTeacher(Long id, TestFromTeacherDTO testDTO) {
        Test test = testRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Test not found with id: " + id));

        test.setTitle(testDTO.getTitle());
        test.setDescription(testDTO.getDescription());
        test.setNumQuestions(testDTO.getNumQuestions());
        test.setTimeLimit(testDTO.getTimeLimit());

        for (MetadataDTO metaDTO : testDTO.getMetadata()) {
            if(test.getMetadata().stream().anyMatch(i-> Objects.equals(i.getKey(), metaDTO.getKey()))){
                Metadata metadata = test.getMetadata().stream().filter(i-> Objects.equals(i.getKey(), metaDTO.getKey())).findFirst().get();
                metadata.setValue(metaDTO.getValue());
                metadataRepository.save(metadata);

            }
            else {
                Metadata metadata = metadataRepository.findByKeyAndValue(metaDTO.getKey(), metaDTO.getValue())
                        .orElseGet(() -> {
                            Metadata newMeta = new Metadata();
                            newMeta.setKey(metaDTO.getKey());
                            newMeta.setValue(metaDTO.getValue());
                            return metadataRepository.save(newMeta);
                        });

                Optional<Metadata> m = test.getMetadata().stream().filter(i->i.getId()
                        .equals(metadata.getId())).findFirst();

                m.ifPresent(value -> test.getMetadata().remove(value));

                test.getMetadata().add(metadata);
            }
        }
        return testRepository.save(test);
    }

    @Override
    public TestTakingViewDTO convertToTestTakingView(StudentTest studentTest) {
        TestTakingViewDTO dto = new TestTakingViewDTO();
        dto.setStudentTestId(studentTest.getId());
        dto.setTestTitle(studentTest.getTest().getTitle());
        dto.setTimeLimit(studentTest.getTest().getTimeLimit());

        List<TestQuestionViewDTO> questions = new ArrayList<>();

        for (StudentAnswer studentAnswer : studentTest.getAnswers()) {
            TestQuestionViewDTO questionDTO = new TestQuestionViewDTO();
            Question question = studentAnswer.getTestQuestion().getQuestion();

            if(question.getImage() != null) {
                questionDTO.setImageId(question.getImage().getId());
            }
            questionDTO.setQuestionId(question.getId());
            questionDTO.setTestQuestionId(studentAnswer.getTestQuestion().getId());
            questionDTO.setDescription(question.getDescription());
            questionDTO.setPoints(question.getPoints());
            questionDTO.setStudentAnswerId(studentAnswer.getId());
            questionDTO.setQuestionType(question.getQuestionType().toString());
            questionDTO.setHint(question.getHint());
            questionDTO.setFormula(question.getFormula());
            List<AnswerViewDTO> answers = question.getAnswers().stream()
                    .map(answer -> {
                        AnswerViewDTO answerDTO = new AnswerViewDTO();
                        answerDTO.setId(answer.getId());
                        answerDTO.setAnswerText(answer.getAnswerText());
                        return answerDTO;
                    })
                    .collect(Collectors.toList());

            Collections.shuffle(answers);
            questionDTO.setPossibleAnswers(answers);

            questions.add(questionDTO);
        }

        Collections.shuffle(questions);
        dto.setQuestions(questions);

        return dto;
    }

    @Override
    public Test createTest(TestDTO testDTO) {
        Teacher creator = teacherRepository.findById(testDTO.getCreatorId())
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found"));

        List<Question> questions = (testDTO.getQuestionIds() != null && !testDTO.getQuestionIds().isEmpty()) ?
                questionRepository.findAllById(testDTO.getQuestionIds()) : Collections.emptyList();

        List<Metadata> metadata = (testDTO.getMetadataIds() != null && !testDTO.getMetadataIds().isEmpty()) ?
                metadataRepository.findAllById(testDTO.getMetadataIds()) : Collections.emptyList();

        // Now use the mapper to create a Test entity from the DTO
        Test test = TestMapper.fromDTO(testDTO, creator, questions, metadata, null, null);

        return testRepository.save(test);
    }
    @Override
    public Test createTestFromTeacher(TestFromTeacherDTO testDTO) {
        Test test = new Test();
        test.setTitle(testDTO.getTitle());
        test.setDescription(testDTO.getDescription());
        test.setNumQuestions(testDTO.getNumQuestions());
        test.setTimeLimit(testDTO.getTimeLimit());
        test.setCreator(userRepository.findById(testDTO.getCreatorId())
                .orElseThrow(() -> new EntityNotFoundException("User not found")));

        if (testDTO.getMetadata() != null) {
            List<Metadata> metadataList = testDTO.getMetadata().stream()
                    .map(metaDTO -> metadataRepository.findByKeyAndValue(metaDTO.getKey(), metaDTO.getValue())
                            .orElseGet(() -> {
                                Metadata newMeta = new Metadata();
                                newMeta.setKey(metaDTO.getKey());
                                newMeta.setValue(metaDTO.getValue());
                                return metadataRepository.save(newMeta);
                            }))
                    .collect(Collectors.toList());

            test.setMetadata(metadataList);
        }

        return testRepository.save(test);
    }
    @Override
    public Test getTestById(Long id) {
        return testRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Test not found"));
    }

    @Override
    public List<Test> getAllTests() {
        return testRepository.findAll();
    }

    @Override
    public Test updateTest(Long id, TestDTO testDTO) {
        Test existingTest = getTestById(id);

        Teacher creator = teacherRepository.findById(testDTO.getCreatorId())
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found"));

        List<Question> questions = (testDTO.getQuestionIds() != null && !testDTO.getQuestionIds().isEmpty()) ?
                questionRepository.findAllById(testDTO.getQuestionIds()) : Collections.emptyList();

        List<Metadata> metadata = (testDTO.getMetadataIds() != null && !testDTO.getMetadataIds().isEmpty()) ?
                metadataRepository.findAllById(testDTO.getMetadataIds()) : Collections.emptyList();

        List<TestQuestion> testQuestions = (testDTO.getTestQuestionIds() != null && !testDTO.getTestQuestionIds().isEmpty()) ?
                testQuestionRepository.findAllById(testDTO.getTestQuestionIds()) : Collections.emptyList();

        List<StudentTest> studentTests = (testDTO.getStudentTestIds() != null && !testDTO.getStudentTestIds().isEmpty()) ?
                studentTestRepository.findAllById(testDTO.getStudentTestIds()) : Collections.emptyList();

        TestMapper.updateFromDTO(existingTest, testDTO, creator, questions, metadata, testQuestions, studentTests);

        return testRepository.save(existingTest);
    }

    @Transactional
    @Override
    public void deleteTest(Long id) {
        Test test = testRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Test with id " + id + " not found"));

        for (StudentTest studentTest : test.getStudentTests()) {
            studentTest.setTest(null);
        }
        for(TestQuestion testQuestion : testQuestionRepository.findByTestId(id)){
            studentAnswerRepository.deleteAllByTestQuestion(testQuestion);
            testQuestionRepository.delete(testQuestion);
        }
        for (Question question : test.getQuestionBank()) {
            question.getTests().remove(test);
        }

        testRepository.deleteById(id);
    }

    @Override
    public List<Test> getTestsByTeacherId(Long teacherId) {
        return testRepository.findByCreatorId(teacherId);
    }

    @Override
    public List<Test> getTestsByTitle(String title) {
        return testRepository.findByTitleContaining(title);
    }

    @Override
    @Transactional
    public StudentTest startTest(Long testId, Long userId) {
        Test test = getTestById(testId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!"Student".equalsIgnoreCase(user.getDtype()) && !"Admin".equalsIgnoreCase(user.getDtype())) {
            throw new IllegalStateException("Only students can take tests. User role: " + user.getDtype());
        }

        Student student = (Student) user;

        List<Question> allQuestions = new ArrayList<>(test.getQuestionBank());

        Collections.shuffle(allQuestions);
        List<Question> selectedQuestions = allQuestions.subList(
                0,
                Math.min(test.getNumQuestions(), allQuestions.size())
        );
        StudentTest studentTest = new StudentTest();

        if (selectedQuestions.isEmpty()) {
            return studentTest;
        }

        studentTest.setTest(test);
        studentTest.setStudent(student);
        studentTest.setScore(0);
        studentTest.setDateTaken(LocalDate.now());
        studentTest.setTimeTaken(LocalTime.now());
        studentTest.setStartTime(LocalDateTime.now());

        studentTest = studentTestRepository.save(studentTest);

        List<StudentAnswer> studentAnswers = new ArrayList<>();

        for (Question question : selectedQuestions) {
            // Create TestQuestion
            TestQuestion testQuestion = new TestQuestion();
            testQuestion.setTest(test);
            testQuestion.setQuestion(question);
            testQuestion = testQuestionRepository.save(testQuestion);

            StudentAnswer studentAnswer = new StudentAnswer();
            studentAnswer.setStudentTest(studentTest);
            studentAnswer.setTestQuestion(testQuestion);
            studentAnswer = studentAnswerRepository.save(studentAnswer);

            studentAnswers.add(studentAnswer);
        }

        studentTest.setAnswers(studentAnswers);
        return studentTestRepository.save(studentTest);
    }
}


