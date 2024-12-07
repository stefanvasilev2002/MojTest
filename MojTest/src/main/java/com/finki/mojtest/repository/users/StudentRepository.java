package com.finki.mojtest.repository.users;

import com.finki.mojtest.model.users.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByGrade(String grade); // Custom query to find students by grade
}
