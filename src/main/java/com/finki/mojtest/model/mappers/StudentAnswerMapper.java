/*
package com.finki.mojtest.model.mappers;

import com.finki.mojtest.model.StudentAnswer;
import com.finki.mojtest.model.dtos.StudentAnswerDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface StudentAnswerMapper {

    StudentAnswerMapper INSTANCE = Mappers.getMapper(StudentAnswerMapper.class);

    @Mapping(target = "studentTestId", source = "studentTest.id")
    @Mapping(target = "testQuestionId", source = "testQuestion.id")
    @Mapping(target = "chosenAnswerId", source = "chosenAnswer.id")
    StudentAnswerDTO studentAnswerToStudentAnswerDTO(StudentAnswer studentAnswer);

    @Mapping(target = "studentTest", ignore = true)
    @Mapping(target = "testQuestion", ignore = true)
    @Mapping(target = "chosenAnswer", ignore = true)
    StudentAnswer studentAnswerDTOToStudentAnswer(StudentAnswerDTO studentAnswerDTO);
}


*/
