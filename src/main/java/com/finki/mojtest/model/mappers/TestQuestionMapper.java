/*
package com.finki.mojtest.model.mappers;

import com.finki.mojtest.model.TestQuestion;
import com.finki.mojtest.model.dtos.TestQuestionDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface TestQuestionMapper {

    TestQuestionMapper INSTANCE = Mappers.getMapper(TestQuestionMapper.class);

    @Mapping(target = "testId", source = "test.id")        // Map the Test ID
    @Mapping(target = "questionId", source = "question.id") // Map the Question ID
    @Mapping(target = "studentAnswerIds", source = "studentAnswers")
    TestQuestionDTO testQuestionToTestQuestionDTO(TestQuestion testQuestion);

    @Mapping(target = "test", ignore = true)  // Ignore relationships when converting back
    @Mapping(target = "question", ignore = true)
    @Mapping(target = "studentAnswers", ignore = true)
    TestQuestion testQuestionDTOToTestQuestion(TestQuestionDTO testQuestionDTO);
}

*/
