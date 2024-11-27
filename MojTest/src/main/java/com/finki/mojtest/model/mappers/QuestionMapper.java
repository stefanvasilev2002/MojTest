package com.finki.mojtest.model.mappers;

import com.finki.mojtest.model.Question;
import com.finki.mojtest.model.dtos.QuestionDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface QuestionMapper {
    QuestionMapper INSTANCE = Mappers.getMapper(QuestionMapper.class);

    QuestionDTO questionToQuestionDTO(Question question);
    Question questionDTOToQuestion(QuestionDTO questionDTO);
}