package com.finki.mojtest.model.mappers;

import com.finki.mojtest.model.Question;
import com.finki.mojtest.model.Test;
import com.finki.mojtest.model.dtos.MetadataDTO;
import com.finki.mojtest.model.dtos.TestDTO;
import com.finki.mojtest.model.users.Teacher;
import com.finki.mojtest.model.Metadata;
import com.finki.mojtest.model.TestQuestion;
import com.finki.mojtest.model.StudentTest;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class TestMapper {

    public static TestDTO toDTO(Test test) {
        if (test == null) return null;

        TestDTO dto = new TestDTO();
        dto.setId(test.getId());
        dto.setTitle(test.getTitle());
        dto.setDescription(test.getDescription());
        dto.setNumQuestions(test.getNumQuestions());
        dto.setCreatorId(test.getCreator() != null ? test.getCreator().getId() : null);

        // Map related entities (using helper methods with null checks)
        dto.setQuestionIds(test.getQuestionBank() != null ?
                test.getQuestionBank().stream().map(Question::getId).collect(Collectors.toList()) :
                Collections.emptyList());

        dto.setMetadataIds(test.getMetadata() != null ?
                test.getMetadata().stream().map(Metadata::getId).collect(Collectors.toList()) :
                Collections.emptyList());

        dto.setMetadata(test.getMetadata() != null ?
                test.getMetadata().stream()
                        .map(metadata -> {
                            MetadataDTO metadataDTO = new MetadataDTO();
                            metadataDTO.setId(metadata.getId());
                            metadataDTO.setKey(metadata.getKey());
                            metadataDTO.setValue(metadata.getValue());
                            return metadataDTO;
                        })
                        .collect(Collectors.toList()) :
                Collections.emptyList());

        dto.setTestQuestionIds(test.getQuestions() != null ?
                test.getQuestions().stream().map(TestQuestion::getId).collect(Collectors.toList()) :
                Collections.emptyList());

        dto.setStudentTestIds(test.getStudentTests() != null ?
                test.getStudentTests().stream().map(StudentTest::getId).collect(Collectors.toList()) :
                Collections.emptyList());

        return dto;
    }

    public static Test fromDTO(TestDTO dto, Teacher creator, List<Question> questions, List<Metadata> metadata, List<TestQuestion> testQuestions, List<StudentTest> studentTests) {
        if (dto == null) return null;

        Test test = new Test();
        test.setId(dto.getId());
        test.setTitle(dto.getTitle());
        test.setDescription(dto.getDescription());
        test.setNumQuestions(dto.getNumQuestions());
        test.setCreator(creator);  // Set the creator (Teacher) using the creatorId field from the DTO

        // Set relationships, these could be null
        test.setQuestionBank(questions != null ? questions : Collections.emptyList());
        test.setMetadata(metadata != null ? metadata : Collections.emptyList());
        test.setQuestions(testQuestions != null ? testQuestions : Collections.emptyList());
        test.setStudentTests(studentTests != null ? studentTests : Collections.emptyList());

        return test;
    }

    public static void updateFromDTO(Test existingTest, TestDTO dto, Teacher creator, List<Question> questions, List<Metadata> metadata, List<TestQuestion> testQuestions, List<StudentTest> studentTests) {
        if (existingTest == null || dto == null) return;

        // Update simple fields
        existingTest.setTitle(dto.getTitle());
        existingTest.setDescription(dto.getDescription());
        existingTest.setNumQuestions(dto.getNumQuestions());

        // Update relationships
        existingTest.setCreator(creator);  // Update creator
        existingTest.setQuestionBank(questions != null ? questions : Collections.emptyList());
        existingTest.setMetadata(metadata != null ? metadata : Collections.emptyList());
        existingTest.setQuestions(testQuestions != null ? testQuestions : Collections.emptyList());
        existingTest.setStudentTests(studentTests != null ? studentTests : Collections.emptyList());
    }
}

