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
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setType(String.valueOf(question.getQuestionType()));  // Note: using type instead of questionType
        dto.setDescription(question.getDescription());
        dto.setPoints(question.getPoints());
        dto.setNegativePointsPerAnswer(question.getNegativePointsPerAnswer());
        dto.setFormula(question.getFormula());
        dto.setHint(question.getHint());
        dto.setCreatorId(question.getCreator() != null ? question.getCreator().getId() : null);

        // Map answers
        if (question.getAnswers() != null) {
            dto.setAnswers(question.getAnswers().stream()
                    .map(answer -> {
                        AnswerDTO answerDTO = new AnswerDTO();
                        answerDTO.setId(answer.getId());
                        answerDTO.setAnswerText(answer.getAnswerText());
                        answerDTO.setCorrect(answer.isCorrect());
                        return answerDTO;
                    })
                    .collect(Collectors.toList()));
        }
        if(question.getMetadata() != null){
            dto.setMetadataIds(question.getMetadata()
                    .stream()
                    .map(Metadata::getId)
                    .collect(Collectors.toList()));
            dto.setMetadataDTOS(question.getMetadata()
                    .stream()
                    .map(MetadataMapper::toDTO)
                    .collect(Collectors.toList()));
        }
        return dto;
    }

    public static Question fromDTO(QuestionDTO dto) {
        Question question = new Question();
        question.setId(dto.getId());
        question.setQuestionType(dto.getType() != null ? QuestionType.valueOf(dto.getType()) : QuestionType.MULTIPLE_CHOICE); // Default to MULTIPLE_CHOICE if null
        question.setDescription(dto.getDescription());
        question.setPoints(dto.getPoints());
        question.setNegativePointsPerAnswer(dto.getNegativePointsPerAnswer());
        question.setFormula(dto.getFormula());
        question.setHint(dto.getHint());

        // Answers will be set by the service
        return question;
    }
    public static Question updateFromDTO(Question existingQuestion, QuestionDTO dto, Teacher creator, List<Test> tests, List<Metadata> metadata, Date uploadedAt) {
        if (existingQuestion == null || dto == null) return null;

        // Update simple fields
        existingQuestion.setQuestionType(dto.getType() != null ? QuestionType.valueOf(dto.getType().toUpperCase()) : null); // Convert string to enum
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
