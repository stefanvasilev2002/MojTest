package com.finki.mojtest.model.mappers;

import com.finki.mojtest.model.Answer;
import com.finki.mojtest.model.dtos.AnswerDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface AnswerMapper {

    AnswerMapper INSTANCE = Mappers.getMapper(AnswerMapper.class);

    // Convert Answer entity to AnswerDTO
    @Mapping(target = "questionId", source = "question.id")  // Map the Question ID
    @Mapping(target = "studentAnswerIds", source = "chosenBy")
    AnswerDTO answerToAnswerDTO(Answer answer);

    // Convert AnswerDTO to Answer entity
    @Mapping(target = "question", ignore = true)  // We won't set the related Question in the reverse mapping
    @Mapping(target = "chosenBy", ignore = true)  // We won't map back the chosenBy relation
    Answer answerDTOToAnswer(AnswerDTO answerDTO);
}

