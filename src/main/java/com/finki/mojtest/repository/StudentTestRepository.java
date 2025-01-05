package com.finki.mojtest.repository;

import com.finki.mojtest.model.StudentTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentTestRepository extends JpaRepository<StudentTest, Long> {
    List<StudentTest> findAllByStudentId(Long studentId);
    List<StudentTest> findAllByTestId(Long testId);
    List<StudentTest> findByTestIdAndStudentIdOrderByDateTakenDescTimeTakenDesc(
            Long testId,
            Long studentId
    );

    Page<StudentTest> findByTestIdAndStudentId(Long testId, Long studentId, Pageable pageable);

}
