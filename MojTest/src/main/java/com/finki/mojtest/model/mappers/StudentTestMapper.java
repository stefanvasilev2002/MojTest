package com.finki.mojtest.model.mappers;

import com.finki.mojtest.model.StudentTest;
import com.finki.mojtest.model.dtos.StudentTestDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface StudentTestMapper {

    StudentTestMapper INSTANCE = Mappers.getMapper(StudentTestMapper.class);

    @Mapping(target = "studentId", source = "student.id")  // Map the Student ID
    @Mapping(target = "testId", source = "test.id")        // Map the Test ID
    @Mapping(target = "studentAnswerIds", source = "answers") // Assuming answers is a List<StudentAnswer>
    StudentTestDTO studentTestToStudentTestDTO(StudentTest studentTest);

    @Mapping(target = "student", ignore = true)  // Ignore relationships when converting back
    @Mapping(target = "test", ignore = true)
    @Mapping(target = "answers", ignore = true)  // Ignore the answers list as well
    StudentTest studentTestDTOToStudentTest(StudentTestDTO studentTestDTO);
}