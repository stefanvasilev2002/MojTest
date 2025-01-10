package com.finki.mojtest.repository;

import com.finki.mojtest.model.Answer;
import com.finki.mojtest.model.Question;
import com.finki.mojtest.model.StudentAnswer;
import com.finki.mojtest.model.TestQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentAnswerRepository extends JpaRepository<StudentAnswer, Long> {
    List<StudentAnswer> findByStudentTestId(Long studentTestId);
    List<StudentAnswer> findByTestQuestionId(Long testQuestionId);
    void deleteAllByTestQuestion(TestQuestion testQuestion);
    List<StudentAnswer> findAllByTestQuestionIn(List<TestQuestion> testQuestions);
}
