package com.finki.mojtest.service;

import com.finki.mojtest.model.users.Student;

import java.util.List;

public interface StudentService {
    Student createStudent(Student student);
    Student getStudentById(Long id);
    List<Student> getAllStudents();
    Student updateStudent(Long id, Student updatedStudent);
    void deleteStudent(Long id);
    List<Student> getStudentsByGrade(String grade);
}

