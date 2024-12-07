package com.finki.mojtest.model.mappers;

import com.finki.mojtest.model.Question;
import com.finki.mojtest.model.Test;
import com.finki.mojtest.model.Metadata;
import com.finki.mojtest.model.Answer;
import com.finki.mojtest.model.dtos.QuestionDTO;
import com.finki.mojtest.model.users.Teacher;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class QuestionMapper {

    public static QuestionDTO toDTO(Question question) {
        if (question == null) return null;

        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setType(question.getType());
        dto.setDescription(question.getDescription());
        dto.setPoints(question.getPoints());
        dto.setNegativePointsPerAnswer(question.getNegativePointsPerAnswer());
        dto.setFormula(question.getFormula());
        dto.setImageUrl(question.getImageUrl());
        dto.setHint(question.getHint());
        dto.setCreatorId(question.getCreator() != null ? question.getCreator().getId() : null);

        // Map related entities (using helper methods with null checks)
        dto.setTestIds(question.getTests() != null ?
                question.getTests().stream().map(Test::getId).collect(Collectors.toList()) :
                Collections.emptyList());

        dto.setMetadataIds(question.getMetadata() != null ?
                question.getMetadata().stream().map(Metadata::getId).collect(Collectors.toList()) :
                Collections.emptyList());

        dto.setAnswerIds(question.getAnswers() != null ?
                question.getAnswers().stream().map(Answer::getId).collect(Collectors.toList()) :
                Collections.emptyList());

        return dto;
    }

    public static Question fromDTO(QuestionDTO dto, Teacher creator, List<Test> tests, List<Metadata> metadata, List<Answer> answers) {
        if (dto == null) return null;

        Question question = new Question();
        question.setId(dto.getId());
        question.setType(dto.getType());
        question.setDescription(dto.getDescription());
        question.setPoints(dto.getPoints());
        question.setNegativePointsPerAnswer(dto.getNegativePointsPerAnswer());
        question.setFormula(dto.getFormula());
        question.setImageUrl(dto.getImageUrl());
        question.setHint(dto.getHint());
        question.setCreator(creator);  // This is set using the creatorId field from the DTO

        // Set relationships, these could be null
        question.setTests(tests != null ? tests : Collections.emptyList());
        question.setMetadata(metadata != null ? metadata : Collections.emptyList());
        question.setAnswers(answers != null ? answers : Collections.emptyList());

        return question;
    }
    public static void updateFromDTO(Question existingQuestion, QuestionDTO dto, Teacher creator, List<Test> tests, List<Metadata> metadata) {
        if (existingQuestion == null || dto == null) return;

        // Update simple fields
        existingQuestion.setType(dto.getType());
        existingQuestion.setDescription(dto.getDescription());
        existingQuestion.setPoints(dto.getPoints());
        existingQuestion.setNegativePointsPerAnswer(dto.getNegativePointsPerAnswer());
        existingQuestion.setFormula(dto.getFormula());
        existingQuestion.setImageUrl(dto.getImageUrl());
        existingQuestion.setHint(dto.getHint());

        // Update relationships
        existingQuestion.setCreator(creator);  // Update creator
        existingQuestion.setTests(tests != null ? tests : Collections.emptyList());
        existingQuestion.setMetadata(metadata != null ? metadata : Collections.emptyList());
    }
}
