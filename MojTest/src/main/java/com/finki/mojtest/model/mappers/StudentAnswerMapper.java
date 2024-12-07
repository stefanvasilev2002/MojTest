//package com.finki.mojtest.model.mappers;
//
//import com.finki.mojtest.model.StudentAnswer;
//import com.finki.mojtest.model.dtos.StudentAnswerDTO;
//import org.mapstruct.Mapper;
//import org.mapstruct.Mapping;
//import org.mapstruct.factory.Mappers;
//
//@Mapper(componentModel = "spring")
//public interface StudentAnswerMapper {
//
//    StudentAnswerMapper INSTANCE = Mappers.getMapper(StudentAnswerMapper.class);
//
//    // Convert StudentAnswer entity to StudentAnswerDTO
//    @Mapping(target = "studentTestId", source = "studentTest.id")  // Map the StudentTest ID
//    @Mapping(target = "testQuestionId", source = "testQuestion.id") // Map the TestQuestion ID
//    @Mapping(target = "chosenAnswerId", source = "chosenAnswer.id") // Map the Answer ID
//    StudentAnswerDTO studentAnswerToStudentAnswerDTO(StudentAnswer studentAnswer);
//
//    // Convert StudentAnswerDTO to StudentAnswer entity
//    @Mapping(target = "studentTest", ignore = true)  // Ignore the reverse mapping of relationships
//    @Mapping(target = "testQuestion", ignore = true)
//    @Mapping(target = "chosenAnswer", ignore = true)
//    StudentAnswer studentAnswerDTOToStudentAnswer(StudentAnswerDTO studentAnswerDTO);
//}
//
//
