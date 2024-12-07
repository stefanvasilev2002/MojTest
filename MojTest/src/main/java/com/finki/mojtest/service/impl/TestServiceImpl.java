package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.*;
import com.finki.mojtest.model.dtos.TestDTO;
import com.finki.mojtest.model.mappers.TestMapper;
import com.finki.mojtest.model.users.Teacher;
import com.finki.mojtest.repository.*;
import com.finki.mojtest.repository.users.TeacherRepository;
import com.finki.mojtest.service.TestService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TestServiceImpl implements TestService {
    private final TestRepository testRepository;
    private final TeacherRepository teacherRepository;
    private final QuestionRepository questionRepository;
    private final MetadataRepository metadataRepository;
    private final StudentTestRepository studentTestRepository;
    private final TestQuestionRepository testQuestionRepository;

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
}


