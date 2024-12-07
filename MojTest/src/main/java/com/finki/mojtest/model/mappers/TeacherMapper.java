//package com.finki.mojtest.model.mappers;
//
//import com.finki.mojtest.model.dtos.TeacherDTO;
//import com.finki.mojtest.model.users.Teacher;
//import org.mapstruct.Mapper;
//import org.mapstruct.Mapping;
//import org.mapstruct.factory.Mappers;
//
//@Mapper(componentModel = "spring")
//public interface TeacherMapper {
//
//    TeacherMapper INSTANCE = Mappers.getMapper(TeacherMapper.class);
//
//    // Teacher to TeacherDTO mapping
//
//    @Mapping(target = "createdTestsIds", source = "createdTests")
//    @Mapping(target = "createdQuestionsIds", source = "createdQuestions")
//    TeacherDTO teacherToTeacherDTO(Teacher teacher);
//
//    // TeacherDTO to Teacher mapping
//
//    Teacher teacherDTOToTeacher(TeacherDTO teacherDTO);
//}
//
