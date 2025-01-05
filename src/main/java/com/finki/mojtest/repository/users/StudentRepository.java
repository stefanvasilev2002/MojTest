package com.finki.mojtest.repository.users;

import com.finki.mojtest.model.users.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByGrade(String grade);
}
