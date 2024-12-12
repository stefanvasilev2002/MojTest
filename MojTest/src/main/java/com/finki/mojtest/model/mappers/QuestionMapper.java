package com.finki.mojtest.model.mappers;

import com.finki.mojtest.model.Metadata;
import com.finki.mojtest.model.Question;
import com.finki.mojtest.model.Answer;
import com.finki.mojtest.model.Test;
import com.finki.mojtest.model.dtos.QuestionDTO;
import com.finki.mojtest.model.enumerations.QuestionType;
import com.finki.mojtest.model.users.Teacher;
import com.finki.mojtest.model.dtos.AnswerDTO;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class QuestionMapper {

    public static QuestionDTO toDTO(Question question) {
        if (question == null) return null;

        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setType(question.getType() != null ? question.getType().name() : "ESSAY"); // Convert enum to string
        dto.setDescription(question.getDescription());
        dto.setPoints(question.getPoints());
        dto.setNegativePointsPerAnswer(question.getNegativePointsPerAnswer());
        dto.setFormula(question.getFormula());
        dto.setImage(FileMapper.toDto(question.getImage()));
        dto.setHint(question.getHint());
        dto.setCreatorId(question.getCreator() != null ? question.getCreator().getId() : null);

        // Map answers to AnswerDTO
        List<AnswerDTO> answerDTOs = question.getAnswers() != null ?
                question.getAnswers().stream()
                        .map(answer -> {
                            AnswerDTO answerDTO = new AnswerDTO();
                            answerDTO.setId(answer.getId());
                            answerDTO.setAnswerText(answer.getAnswerText());
                            return answerDTO;
                        })
                        .collect(Collectors.toList()) :
                Collections.emptyList();

        dto.setAnswers(answerDTOs);
        dto.setTestIds(question.getTests() != null ?
                question.getTests().stream().map(Test::getId).collect(Collectors.toList()) :
                Collections.emptyList());

        dto.setMetadataIds(question.getMetadata() != null ?
                question.getMetadata().stream().map(Metadata::getId).collect(Collectors.toList()) :
                Collections.emptyList());

        dto.setAnswerIds(question.getAnswers() != null ?
                question.getAnswers().stream().map(Answer::getId).collect(Collectors.toList()) :
                Collections.emptyList());

        dto.setAnswers(answerDTOs);
        return dto;
    }

    public static Question fromDTO(QuestionDTO dto, Teacher creator, List<Test> tests, List<Metadata> metadata, List<Answer> answers,String filePath, Date uploadedAt) {
        if (dto == null) return null;

        Question question = new Question();
        question.setId(dto.getId());
        question.setType(dto.getType() != null ? QuestionType.valueOf(dto.getType()) : QuestionType.ESSAY); // Convert enum to string
        question.setDescription(dto.getDescription());
        question.setPoints(dto.getPoints());
        question.setNegativePointsPerAnswer(dto.getNegativePointsPerAnswer());
        question.setFormula(dto.getFormula());
        question.setImage(FileMapper.toEntityFromDto(dto.getImage(), uploadedAt));
        question.setHint(dto.getHint());
        question.setCreator(creator);  // This is set using the creatorId field from the DTO

        // Set relationships, these could be null
        question.setTests(tests != null ? tests : Collections.emptyList());
        question.setMetadata(metadata != null ? metadata : Collections.emptyList());
        question.setAnswers(answers != null ? answers : Collections.emptyList());

        question.setDescription(dto.getDescription());

        return question;
    }
    public static Question updateFromDTO(Question existingQuestion, QuestionDTO dto, Teacher creator, List<Test> tests, List<Metadata> metadata, Date uploadedAt) {
        if (existingQuestion == null || dto == null) return null;

        // Update simple fields
        existingQuestion.setType(dto.getType() != null ? QuestionType.valueOf(dto.getType().toUpperCase()) : null); // Convert string to enum
        existingQuestion.setDescription(dto.getDescription());
        existingQuestion.setPoints(dto.getPoints());
        existingQuestion.setNegativePointsPerAnswer(dto.getNegativePointsPerAnswer());
        existingQuestion.setFormula(dto.getFormula());
        if (dto.getImage() != null) {
            if (existingQuestion.getImage() == null) {
                existingQuestion.setImage(FileMapper.toEntityFromDto(dto.getImage(), uploadedAt));
            } else {
                FileMapper.updateFromDto(existingQuestion.getImage(), dto.getImage(), uploadedAt);
            }
        }
        existingQuestion.setHint(dto.getHint());

        // Update relationships
        existingQuestion.setCreator(creator);  // Update creator
        existingQuestion.setTests(tests != null ? tests : Collections.emptyList());
        existingQuestion.setMetadata(metadata != null ? metadata : Collections.emptyList());
        existingQuestion.setDescription(dto.getDescription());
        return existingQuestion;
    }
}
