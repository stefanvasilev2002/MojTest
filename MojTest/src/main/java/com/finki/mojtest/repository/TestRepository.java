package com.finki.mojtest.repository;

import com.finki.mojtest.model.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestRepository extends JpaRepository<Test, Long> {
    List<Test> findByCreatorId(Long teacherId); // Find tests created by a specific teacher
    List<Test> findByTitleContaining(String title); // Search tests by partial title
}
