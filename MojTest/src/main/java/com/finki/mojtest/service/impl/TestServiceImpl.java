package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.*;
import com.finki.mojtest.model.dtos.MetadataDTO;
import com.finki.mojtest.model.dtos.TestDTO;
import com.finki.mojtest.model.dtos.TestFromTeacherDTO;
import com.finki.mojtest.model.mappers.TestMapper;
import com.finki.mojtest.model.users.Student;
import com.finki.mojtest.model.users.Teacher;
import com.finki.mojtest.model.users.User;
import com.finki.mojtest.repository.*;
import com.finki.mojtest.repository.users.StudentRepository;
import com.finki.mojtest.repository.users.TeacherRepository;
import com.finki.mojtest.repository.users.UserRepository;
import com.finki.mojtest.service.TestService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
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
    private final StudentRepository studentRepository;
    private final StudentAnswerRepository studentAnswerRepository;
    private final UserRepository userRepository;
    @Transactional
    public Test addQuestionToTest(Long testId, Long questionId) {
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new EntityNotFoundException("Test not found with id: " + testId));

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + questionId));

        // Check if question is already in the test
        if (test.getQuestionBank().contains(question)) {
            throw new IllegalStateException("Question is already in the test");
        }

        // Add question to test's question bank
        test.getQuestionBank().add(question);

        return testRepository.save(test);
    }

    @Transactional
    public Test removeQuestionFromTest(Long testId, Long questionId) {
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new EntityNotFoundException("Test not found with id: " + testId));

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + questionId));

        // Check if question is in the test
        if (!test.getQuestionBank().contains(question)) {
            throw new IllegalStateException("Question is not in the test");
        }

        // Remove question from test's question bank
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
            Metadata metadata = metadataRepository.findByKeyAndValue(metaDTO.getKey(), metaDTO.getValue())
                    .orElseGet(() -> {
                        Metadata newMeta = new Metadata();
                        newMeta.setKey(metaDTO.getKey());
                        newMeta.setValue(metaDTO.getValue());
                        return metadataRepository.save(newMeta);
                    });

            test.getMetadata().add(metadata);
        }
        return testRepository.save(test);
    }

    @Override
    public Test createTest(TestDTO testDTO) {
        // Resolve relationships based on the DTO data
        Teacher creator = teacherRepository.findById(testDTO.getCreatorId())
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found"));

        List<Question> questions = (testDTO.getQuestionIds() != null && !testDTO.getQuestionIds().isEmpty()) ?
                questionRepository.findAllById(testDTO.getQuestionIds()) : Collections.emptyList();

        List<Metadata> metadata = (testDTO.getMetadataIds() != null && !testDTO.getMetadataIds().isEmpty()) ?
                metadataRepository.findAllById(testDTO.getMetadataIds()) : Collections.emptyList();

        // Now use the mapper to create a Test entity from the DTO
        Test test = TestMapper.fromDTO(testDTO, creator, questions, metadata, null, null);

        // Save the test entity to the repository
        return testRepository.save(test);
    }
    @Override
    public Test createTestFromTeacher(TestFromTeacherDTO testDTO) {
        Test test = new Test();
        test.setTitle(testDTO.getTitle());
        test.setDescription(testDTO.getDescription());
        test.setNumQuestions(testDTO.getNumQuestions());
        test.setTimeLimit(testDTO.getTimeLimit());

        // Handle metadata
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
        // Fetch the existing test entity
        Test existingTest = getTestById(id);

        // Resolve relationships based on the DTO data
        Teacher creator = teacherRepository.findById(testDTO.getCreatorId())
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found"));

        List<Question> questions = (testDTO.getQuestionIds() != null && !testDTO.getQuestionIds().isEmpty()) ?
                questionRepository.findAllById(testDTO.getQuestionIds()) : Collections.emptyList();

        List<Metadata> metadata = (testDTO.getMetadataIds() != null && !testDTO.getMetadataIds().isEmpty()) ?
                metadataRepository.findAllById(testDTO.getMetadataIds()) : Collections.emptyList();

        // Resolve other relationships (TestQuestion and StudentTest)
        List<TestQuestion> testQuestions = (testDTO.getTestQuestionIds() != null && !testDTO.getTestQuestionIds().isEmpty()) ?
                testQuestionRepository.findAllById(testDTO.getTestQuestionIds()) : Collections.emptyList();

        List<StudentTest> studentTests = (testDTO.getStudentTestIds() != null && !testDTO.getStudentTestIds().isEmpty()) ?
                studentTestRepository.findAllById(testDTO.getStudentTestIds()) : Collections.emptyList();

        // Now use the updateFromDTO method to update the existing test with new data
        TestMapper.updateFromDTO(existingTest, testDTO, creator, questions, metadata, testQuestions, studentTests);

        // Save and return the updated test
        return testRepository.save(existingTest);
    }

    @Transactional
    @Override
    public void deleteTest(Long id) {
        Test test = testRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Test with id " + id + " not found"));

        // Remove references to the test from related entities before deletion
        for (StudentTest studentTest : test.getStudentTests()) {
            studentTest.setTest(null);  // Remove reference from StudentTest
        }

        // Remove the test from the question bank (Many-to-Many relation)
        for (Question question : test.getQuestionBank()) {
            question.getTests().remove(test);  // Remove the test from the list of tests in Question
        }

        // Delete the test entity
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
        // 1. Get the test
        Test test = getTestById(testId);

        // 2. Get the user and verify it's a Student
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!"Student".equalsIgnoreCase(user.getDtype()) && !"Admin".equalsIgnoreCase(user.getDtype())) {
            throw new IllegalStateException("Only students can take tests. User role: " + user.getDtype());
        }

        Student student = (Student) user;  // Cast to Student after verifying the type

        // 3. Get all questions from the test's question bank
        List<Question> allQuestions = new ArrayList<>(test.getQuestionBank());

        // 4. Randomly select numQuestions questions
        Collections.shuffle(allQuestions);
        List<Question> selectedQuestions = allQuestions.subList(
                0,
                Math.min(test.getNumQuestions(), allQuestions.size())
        );

        // 5. Create a new StudentTest
        StudentTest studentTest = new StudentTest();
        studentTest.setTest(test);
        studentTest.setStudent(student);
        studentTest.setScore(0);
        studentTest.setDateTaken(LocalDate.now());
        studentTest.setTimeTaken(LocalTime.now());

        // Save the StudentTest to get an ID
        studentTest = studentTestRepository.save(studentTest);

        // 6. Create TestQuestions and StudentAnswers for each selected question
        List<StudentAnswer> studentAnswers = new ArrayList<>();

        for (Question question : selectedQuestions) {
            // Create TestQuestion
            TestQuestion testQuestion = new TestQuestion();
            testQuestion.setTest(test);
            testQuestion.setQuestion(question);
            testQuestion = testQuestionRepository.save(testQuestion);

            // Create empty StudentAnswer
            StudentAnswer studentAnswer = new StudentAnswer();
            studentAnswer.setStudentTest(studentTest);
            studentAnswer.setTestQuestion(testQuestion);
            studentAnswer = studentAnswerRepository.save(studentAnswer);

            studentAnswers.add(studentAnswer);
        }

        // 7. Set the answers and save the final StudentTest
        studentTest.setAnswers(studentAnswers);
        return studentTestRepository.save(studentTest);
    }
}


