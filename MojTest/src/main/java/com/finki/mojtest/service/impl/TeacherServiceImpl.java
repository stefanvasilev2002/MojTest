package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.users.Teacher;
import com.finki.mojtest.repository.users.TeacherRepository;
import com.finki.mojtest.service.TeacherService;
import com.finki.mojtest.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService {
    private final TeacherRepository teacherRepository;
    private final UserService userService;

    @Override
    public Teacher createTeacher(Teacher teacher) {
        return (Teacher) userService.createUser(teacher);
    }

    @Override
    public Teacher getTeacherById(Long id) {
        return teacherRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found with id " + id));
    }

    @Override
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    @Override
    public Teacher updateTeacher(Long id, Teacher updatedTeacher) {
        userService.updateUser(id, updatedTeacher);

        Teacher teacher = getTeacherById(id);

        return teacherRepository.save(teacher);
    }


    @Override
    public void deleteTeacher(Long id) {
        getTeacherById(id);
        teacherRepository.deleteById(id);
    }
}
