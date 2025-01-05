package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.users.Student;
import com.finki.mojtest.repository.users.StudentRepository;
import com.finki.mojtest.service.StudentService;
import com.finki.mojtest.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {
    private final StudentRepository studentRepository;
    private final UserService userService;


    @Override
    public Student createStudent(Student student) {
        return (Student) userService.createUser(student);
    }

    @Override
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Student not found with id " + id));
    }

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public Student updateStudent(Long id, Student updatedStudent) {
        userService.updateUser(id, updatedStudent);

        Student student = getStudentById(id);

        if (updatedStudent.getGrade() != null) {
            student.setGrade(updatedStudent.getGrade());
        }

        return studentRepository.save(student);
    }

    @Override
    public void deleteStudent(Long id) {
        getStudentById(id);
        studentRepository.deleteById(id);
    }

    @Override
    public List<Student> getStudentsByGrade(String grade) {
        return studentRepository.findByGrade(grade);
    }
}