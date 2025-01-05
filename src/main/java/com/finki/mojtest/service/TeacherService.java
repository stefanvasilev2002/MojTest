package com.finki.mojtest.service;

import com.finki.mojtest.model.users.Teacher;

import java.util.List;

public interface TeacherService {
    Teacher createTeacher(Teacher teacher);
    Teacher getTeacherById(Long id);
    List<Teacher> getAllTeachers();
    Teacher updateTeacher(Long id, Teacher updatedTeacher);
    void deleteTeacher(Long id);
}
