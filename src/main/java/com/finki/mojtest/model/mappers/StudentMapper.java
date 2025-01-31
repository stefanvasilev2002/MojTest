/*
package com.finki.mojtest.model.mappers;

import com.finki.mojtest.model.dtos.StudentDTO;
import com.finki.mojtest.model.users.Student;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface StudentMapper {

    StudentMapper INSTANCE = Mappers.getMapper(StudentMapper.class);


    @Mapping(target = "takenTestsIds", source = "takenTests")
    StudentDTO studentToStudentDTO(Student student);


    Student studentDTOToStudent(StudentDTO studentDTO);
}
*/
