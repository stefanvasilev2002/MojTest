package com.finki.mojtest.repository;

import com.finki.mojtest.model.StudentTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentTestRepository extends JpaRepository<StudentTest, Long> {
    List<StudentTest> findAllByStudentId(Long studentId); // Find tests taken by a specific student
    List<StudentTest> findAllByTestId(Long testId); // Find all submissions for a specific test
}
