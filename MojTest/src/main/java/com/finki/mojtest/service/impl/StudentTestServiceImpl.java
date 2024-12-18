package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.Answer;
import com.finki.mojtest.model.Question;
import com.finki.mojtest.model.StudentAnswer;
import com.finki.mojtest.model.StudentTest;
import com.finki.mojtest.model.dtos.*;
import com.finki.mojtest.repository.AnswerRepository;
import com.finki.mojtest.repository.QuestionRepository;
import com.finki.mojtest.repository.StudentAnswerRepository;
import com.finki.mojtest.repository.StudentTestRepository;
import com.finki.mojtest.service.StudentTestService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StudentTestServiceImpl implements StudentTestService {
    private final StudentTestRepository studentTestRepository;
    private final StudentAnswerRepository studentAnswerRepository;
    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;

    public StudentTestServiceImpl(StudentTestRepository studentTestRepository, StudentAnswerRepository studentAnswerRepository, AnswerRepository answerRepository, QuestionRepository questionRepository) {
        this.studentTestRepository = studentTestRepository;
        this.studentAnswerRepository = studentAnswerRepository;
        this.answerRepository = answerRepository;
        this.questionRepository = questionRepository;
    }

    @Override
    public StudentTest createStudentTest(StudentTest studentTest) {
        studentTest.setDateTaken(LocalDate.now());
        studentTest.setTimeTaken(LocalTime.now());
        int score = calculateScore(studentTest.getAnswers());
        studentTest.setScore(score);

        return studentTestRepository.save(studentTest);
    }

    @Override
    public StudentTest getStudentTestById(Long id) {
        return studentTestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student Test not found"));
    }

    @Override
    public List<StudentTest> getAllStudentTests() {
        return studentTestRepository.findAll();
    }

    @Override
    public StudentTest updateStudentTest(Long id, StudentTest updatedStudentTest) {
        StudentTest studentTest = getStudentTestById(id);
        studentTest.setScore(updatedStudentTest.getScore()); // Optionally recalculate score
        studentTest.setDateTaken(updatedStudentTest.getDateTaken());
        studentTest.setTimeTaken(updatedStudentTest.getTimeTaken());
        return studentTestRepository.save(studentTest);
    }

    @Override
    public void deleteStudentTest(Long id) {
        List<StudentAnswer> studentAnswers = getStudentTestById(id).getAnswers();

        studentAnswerRepository.deleteAll(studentAnswers);

        studentTestRepository.deleteById(id);
    }

    @Override
    public List<StudentTest> getStudentTestsByStudentId(Long studentId) {
        return studentTestRepository.findAllByStudentId(studentId);
    }

    @Override
    public List<StudentTest> getStudentTestsByTestId(Long testId) {
        return studentTestRepository.findAllByTestId(testId);
    }

    @Override
    public TestTakingDTO getStudentTestWithQuestionsAndAnswers(Long studentTestId) {
        StudentTest studentTest = studentTestRepository.findById(studentTestId)
                .orElseThrow(() -> new EntityNotFoundException("Student Test not found"));

        TestTakingDTO dto = new TestTakingDTO();
        dto.setStudentTestId(studentTest.getId());
        dto.setTestTitle(studentTest.getTest().getTitle());
        dto.setTimeLimit(studentTest.getTest().getTimeLimit());

        List<TestQuestionAnswerDTO> answers = studentTest.getAnswers().stream()
                .map(this::convertToTestQuestionAnswerDTO)
                .collect(Collectors.toList());

        dto.setAnswers(answers);
        return dto;
    }

    private TestQuestionAnswerDTO convertToTestQuestionAnswerDTO(StudentAnswer studentAnswer) {
        TestQuestionAnswerDTO dto = new TestQuestionAnswerDTO();
        dto.setId(studentAnswer.getId());

        TestQuestionDTO testQuestionDTO = new TestQuestionDTO();
        testQuestionDTO.setId(studentAnswer.getTestQuestion().getId());

        QuestionDTO questionDTO = new QuestionDTO();
        Question question = studentAnswer.getTestQuestion().getQuestion();
        questionDTO.setId(question.getId());
        questionDTO.setDescription(question.getDescription());

        List<AnswerDTO> answers = question.getAnswers().stream()
                .map(answer -> {
                    AnswerDTO answerDTO = new AnswerDTO();
                    answerDTO.setId(answer.getId());
                    answerDTO.setAnswerText(answer.getAnswerText());
                    return answerDTO;
                })
                .collect(Collectors.toList());
        Collections.shuffle(answers); // Shuffle answers
        questionDTO.setAnswers(answers);

        testQuestionDTO.setQuestion(questionDTO);
        dto.setTestQuestion(testQuestionDTO);
        dto.setChosenAnswer(studentAnswer.getChosenAnswer() != null ?
                convertToAnswerDTO(studentAnswer.getChosenAnswer()) : null);

        return dto;
    }

    private AnswerDTO convertToAnswerDTO(Answer answer) {
        AnswerDTO dto = new AnswerDTO();
        dto.setId(answer.getId());
        dto.setAnswerText(answer.getAnswerText());
        return dto;
    }

    @Override
    public StudentTest submitTest(Long studentTestId) {
        StudentTest studentTest = studentTestRepository.findById(studentTestId)
                .orElseThrow(() -> new EntityNotFoundException("Student Test not found"));

        // Calculate score
        int score = calculateScore(studentTest.getAnswers());
        studentTest.setScore(score);

        return studentTestRepository.save(studentTest);
    }

    public TestFeedbackDTO evaluateTest(Long studentTestId, List<AnswerSubmissionDTO> answers) {
        // Retrieve the student test from the database
        StudentTest studentTest = studentTestRepository.findById(studentTestId)
                .orElseThrow(() -> new EntityNotFoundException("Student Test not found"));

        // Prepare feedback DTO
        TestFeedbackDTO feedbackDTO = new TestFeedbackDTO();
        feedbackDTO.setStudentTestId(studentTestId);

        // List to store feedback details for each answer
        List<AnswerFeedbackDTO> answerFeedbackList = new ArrayList<>();

        // Map of the answers submitted by the student, keyed by the question ID
        Map<Long, List<AnswerSubmissionDTO>> answerMap = answers.stream()
                .collect(Collectors.groupingBy(AnswerSubmissionDTO::getQuestionId));

        // Calculate the score by iterating through the test's answers
        int totalScore = 0;
        int maxScore = 0;

        for (Map.Entry<Long, List<AnswerSubmissionDTO>> entry : answerMap.entrySet()) {
            Long questionId = entry.getKey();
            List<AnswerSubmissionDTO> submittedAnswers = entry.getValue();
            Question question = questionRepository.findById(questionId).get(); // Retrieve the question

            // Track correctness of multiple answers for the same question
            List<String> correctAnswerTexts = new ArrayList<>();
            List<String> submittedAnswerTexts = new ArrayList<>();
            boolean isCorrect = true;

            for (AnswerSubmissionDTO dto : submittedAnswers) {
                // Evaluate each submitted answer
                Answer answer = answerRepository.findById(dto.getAnswerId()).get();
                boolean answerIsCorrect = question.getAnswers().stream()
                        .anyMatch(x -> Objects.equals(x.getId(), dto.getAnswerId()) && x.isCorrect());

                if (answerIsCorrect) {
                    correctAnswerTexts.add(answer.getAnswerText());
                }
                submittedAnswerTexts.add(answer.getAnswerText());

                // Update the score
                int questionScore = question.getPoints();
                if (answerIsCorrect) {
                    totalScore += questionScore;
                } else {
                    totalScore -= question.getNegativePointsPerAnswer();
                    isCorrect = false; // If any answer is wrong, the whole submission is incorrect
                }
            }

            // Prepare the feedback DTO for this question
            AnswerFeedbackDTO answerFeedbackDTO = new AnswerFeedbackDTO();
            answerFeedbackDTO.setQuestionId(questionId);
            answerFeedbackDTO.setCorrectAnswer(isCorrect);  // The overall correctness of the question
            answerFeedbackDTO.setQuestionText(question.getDescription());
            answerFeedbackDTO.setCorrectAnswerText(Collections.singletonList(String.join(", ", correctAnswerTexts)));
            answerFeedbackDTO.setSubmittedAnswerText(Collections.singletonList(String.join(", ", submittedAnswerTexts)));

            answerFeedbackList.add(answerFeedbackDTO);
            maxScore += question.getPoints(); // Track maximum score
        }

        // Set feedback and score to DTO
        feedbackDTO.setAnswerFeedbackList(answerFeedbackList);
        feedbackDTO.setTotalScore(totalScore);
        feedbackDTO.setMaxScore(maxScore);

        // Return feedback DTO
        return feedbackDTO;
    }



    private int calculateScore(List<StudentAnswer> answers) {
        return answers.stream()
                .mapToInt(answer -> {
                    if (answer.getChosenAnswer() != null) {
                        return answer.getChosenAnswer().isCorrect() ?
                                answer.getTestQuestion().getQuestion().getPoints() :
                                -answer.getTestQuestion().getQuestion().getNegativePointsPerAnswer();
                    }
                    return 0;
                })
                .sum();
    }
}
