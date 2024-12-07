package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.users.Teacher;
import com.finki.mojtest.model.users.User;
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
        User updatedUser = (User) updatedTeacher;
        updatedUser = userService.updateUser(id, updatedUser);

        // After updating common fields, update teacher-specific fields (if any)
        Teacher teacher = getTeacherById(id);


        // You can update teacher-specific fields here if needed
        // We don't have any right now however we will have them in future

        return teacherRepository.save(teacher); // Save the updated teacher
    }


    @Override
    public void deleteTeacher(Long id) {
        getTeacherById(id); // Validate existence
        teacherRepository.deleteById(id);
    }
}
