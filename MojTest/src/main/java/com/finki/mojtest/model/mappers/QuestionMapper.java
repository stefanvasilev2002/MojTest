package com.finki.mojtest.model.mappers;

import com.finki.mojtest.model.Question;
import com.finki.mojtest.model.Answer;
import com.finki.mojtest.model.dtos.QuestionDTO;
import com.finki.mojtest.model.dtos.AnswerDTO;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class QuestionMapper {

    public static QuestionDTO toDTO(Question question) {
        if (question == null) return null;

        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setDescription(question.getDescription());

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

        return dto;
    }

    public static Question fromDTO(QuestionDTO dto) {
        if (dto == null) return null;

        Question question = new Question();
        question.setId(dto.getId());
        question.setDescription(dto.getDescription());
        return question;
    }

    public static void updateFromDTO(Question existingQuestion, QuestionDTO dto) {
        if (existingQuestion == null || dto == null) return;

        existingQuestion.setDescription(dto.getDescription());
    }
}