package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.*;
import com.finki.mojtest.model.dtos.*;
import com.finki.mojtest.model.enumerations.QuestionType;
import com.finki.mojtest.repository.*;
import com.finki.mojtest.service.StudentTestService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class StudentTestServiceImpl implements StudentTestService {
    private final StudentTestRepository studentTestRepository;
    private final StudentAnswerRepository studentAnswerRepository;
    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final TestQuestionRepository testQuestionRepository;

    public StudentTestServiceImpl(StudentTestRepository studentTestRepository, StudentAnswerRepository studentAnswerRepository, AnswerRepository answerRepository, QuestionRepository questionRepository, TestQuestionRepository testQuestionRepository) {
        this.studentTestRepository = studentTestRepository;
        this.studentAnswerRepository = studentAnswerRepository;
        this.answerRepository = answerRepository;
        this.questionRepository = questionRepository;
        this.testQuestionRepository = testQuestionRepository;
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
        questionDTO.setHint(question.getHint());

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

    @Override
    @Transactional
    public TestFeedbackDTO evaluateTest(Long studentTestId, List<AnswerSubmissionDTO> answers) {
        StudentTest studentTest = studentTestRepository.findById(studentTestId)
                .orElseThrow(() -> new EntityNotFoundException("Student Test not found"));

        TestFeedbackDTO feedbackDTO = new TestFeedbackDTO();
        feedbackDTO.setStudentTestId(studentTestId);

        List<AnswerFeedbackDTO> answerFeedbackList = new ArrayList<>();
        Map<Long, List<AnswerSubmissionDTO>> submittedAnswerMap = answers.stream()
                .collect(Collectors.groupingBy(AnswerSubmissionDTO::getQuestionId));

        int totalScore = 0;
        int maxScore = 0;

        // Delete existing answers
        List<StudentAnswer> existingAnswers = studentAnswerRepository.findByStudentTestId(studentTestId);
        if (!existingAnswers.isEmpty()) {
            studentAnswerRepository.deleteAll(existingAnswers);
            studentAnswerRepository.flush(); // Ensure deletions are processed
        }

        // Get a Set of processed question IDs to avoid duplicates
        Set<Long> processedQuestionIds = new HashSet<>();

        // Process ALL questions in the test
        for (TestQuestion testQuestion : studentTest.getTest().getQuestions()) {
            Question question = testQuestion.getQuestion();

            // Skip if we've already processed this question
            if (!processedQuestionIds.add(question.getId())) {
                continue;
            }

            List<AnswerSubmissionDTO> submittedAnswers = submittedAnswerMap.getOrDefault(question.getId(), new ArrayList<>());

            AnswerFeedbackDTO answerFeedbackDTO = new AnswerFeedbackDTO();
            answerFeedbackDTO.setQuestionId(question.getId());
            answerFeedbackDTO.setQuestionText(question.getDescription());

            // If no answer was submitted
            if (submittedAnswers.isEmpty()) {
                processUnansweredQuestion(studentTest, testQuestion, question, answerFeedbackDTO);
                if (question.getQuestionType() != QuestionType.ESSAY) {
                    totalScore -= question.getNegativePointsPerAnswer();
                }
            } else {
                boolean isCorrect = processAnsweredQuestion(
                        studentTest, testQuestion, question, submittedAnswers, answerFeedbackDTO);

                if (isCorrect) {
                    totalScore += question.getPoints();
                } else if (question.getQuestionType() != QuestionType.ESSAY) {
                    totalScore -= question.getNegativePointsPerAnswer();
                }
            }

            maxScore += question.getPoints();
            answerFeedbackList.add(answerFeedbackDTO);
        }

        feedbackDTO.setAnswerFeedbackList(answerFeedbackList);
        feedbackDTO.setTotalScore(Math.max(0, totalScore));
        feedbackDTO.setMaxScore(maxScore);

        // Update and save student test
        studentTest.setScore(Math.max(0, totalScore));
        studentTestRepository.save(studentTest);

        return feedbackDTO;
    }

    @Override
    public Page<TestAttemptDTO> getTestAttempts(Long testId, Long studentId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("dateTaken").descending().and(Sort.by("timeTaken").descending()));

        Page<StudentTest> attempts = studentTestRepository.findByTestIdAndStudentId(testId, studentId, pageable);

        return attempts.map(attempt -> {
            // For each attempt, calculate total points from its specific answers
            int totalPoints = attempt.getAnswers().stream()
                    .map(StudentAnswer::getTestQuestion)  // Get TestQuestion from each StudentAnswer
                    .map(TestQuestion::getQuestion)       // Get Question from TestQuestion
                    .mapToInt(Question::getPoints)        // Sum the points
                    .sum();

            return new TestAttemptDTO(
                    attempt.getId(),
                    attempt.getScore(),
                    totalPoints,  // Now using points only from questions in this specific attempt
                    attempt.getDateTaken(),
                    attempt.getTimeTaken()
            );
        });
    }

    @Override
    public TestResultsDTO getTestResults(Long studentTestId) {
        StudentTest studentTest = studentTestRepository.findById(studentTestId)
                .orElseThrow(() -> new EntityNotFoundException("Student test not found"));

        List<QuestionResultDTO> questionResults = studentTest.getAnswers().stream()
                .map(studentAnswer -> {
                    Question question = studentAnswer.getTestQuestion().getQuestion();
                    return QuestionResultDTO.builder()
                            .questionId(question.getId())
                            .description(question.getDescription())
                            .questionType(question.getQuestionType().toString())
                            .points(question.getPoints())
                            .studentAnswer(getStudentAnswer(studentAnswer))
                            .correctAnswer(getCorrectAnswer(question))
                            .imageId(question.getImage() != null ? question.getImage().getId() : null)
                            .build();
                })
                .collect(Collectors.toList());

        return TestResultsDTO.builder()
                .studentTestId(studentTestId)
                .testTitle(studentTest.getTest().getTitle())
                .questions(questionResults)
                .score(studentTest.getScore())
                .totalPoints(calculateTotalPoints(studentTest))
                .scorePercentage((double) studentTest.getScore() / calculateTotalPoints(studentTest) * 100)
                .build();
    }

    private String getStudentAnswer(StudentAnswer sa) {
        return sa.getChosenAnswer() != null ?
                sa.getChosenAnswer().getAnswerText() :
                sa.getSubmittedValue();
    }

    private String getCorrectAnswer(Question q) {
        return q.getAnswers().stream()
                .filter(Answer::isCorrect)
                .map(Answer::getAnswerText)
                .collect(Collectors.joining(", "));
    }

    private int calculateTotalPoints(StudentTest st) {
        return st.getTest().getQuestions().stream()
                .mapToInt(tq -> tq.getQuestion().getPoints())
                .sum();
    }

    private void processUnansweredQuestion(StudentTest studentTest, TestQuestion testQuestion,
                                           Question question, AnswerFeedbackDTO answerFeedbackDTO) {
        StudentAnswer studentAnswer = new StudentAnswer();
        studentAnswer.setStudentTest(studentTest);
        studentAnswer.setTestQuestion(testQuestion);
        studentAnswerRepository.save(studentAnswer);

        answerFeedbackDTO.setCorrectAnswer(false);
        answerFeedbackDTO.setSubmittedAnswerText(Collections.singletonList("No answer provided"));

        List<String> correctAnswerTexts = question.getAnswers().stream()
                .filter(Answer::isCorrect)
                .map(Answer::getAnswerText)
                .collect(Collectors.toList());
        answerFeedbackDTO.setCorrectAnswerText(correctAnswerTexts);
    }

    private boolean processAnsweredQuestion(StudentTest studentTest, TestQuestion testQuestion,
                                            Question question, List<AnswerSubmissionDTO> submissions,
                                            AnswerFeedbackDTO answerFeedbackDTO) {
        for (AnswerSubmissionDTO submission : submissions) {
            StudentAnswer studentAnswer = new StudentAnswer();
            studentAnswer.setStudentTest(studentTest);
            studentAnswer.setTestQuestion(testQuestion);

            if (submission.getAnswerId() != null) {
                Answer answer = answerRepository.findById(submission.getAnswerId())
                        .orElseThrow(() -> new EntityNotFoundException("Answer not found"));
                studentAnswer.setChosenAnswer(answer);
            }

            studentAnswerRepository.save(studentAnswer);
        }

        // Evaluate based on question type and update feedback
        switch (question.getQuestionType()) {
            case MULTIPLE_CHOICE:
                evaluateMultipleChoice(submissions, question, answerFeedbackDTO);
                break;
            case TRUE_FALSE:
                evaluateTrueFalse(submissions.get(0), question, answerFeedbackDTO);
                break;
            case NUMERIC:
                evaluateNumeric(submissions.get(0), question, answerFeedbackDTO);
                break;
            case FILL_IN_THE_BLANK:
                evaluateFillInTheBlank(submissions.get(0), question, answerFeedbackDTO);
                break;
            case ESSAY:
                evaluateEssay(submissions.get(0), question, answerFeedbackDTO);
                break;
        }

        return answerFeedbackDTO.isCorrectAnswer();
    }    private void evaluateMultipleChoice(List<AnswerSubmissionDTO> submissions, Question question, AnswerFeedbackDTO feedback) {
        List<String> correctAnswerTexts = new ArrayList<>();
        List<String> submittedAnswerTexts = new ArrayList<>();
        Set<Long> correctAnswerIds = question.getAnswers().stream()
                .filter(Answer::isCorrect)
                .map(Answer::getId)
                .collect(Collectors.toSet());

        Set<Long> submittedAnswerIds = submissions.stream()
                .map(AnswerSubmissionDTO::getAnswerId)
                .collect(Collectors.toSet());

        // Get text of submitted answers
        for (AnswerSubmissionDTO submission : submissions) {
            Answer answer = answerRepository.findById(submission.getAnswerId())
                    .orElseThrow(() -> new EntityNotFoundException("Answer not found"));
            submittedAnswerTexts.add(answer.getAnswerText());
        }

        // Get text of correct answers
        question.getAnswers().stream()
                .filter(Answer::isCorrect)
                .forEach(answer -> correctAnswerTexts.add(answer.getAnswerText()));

        // Check if answers match exactly
        boolean isCorrect = correctAnswerIds.equals(submittedAnswerIds);

        feedback.setCorrectAnswer(isCorrect);
        feedback.setCorrectAnswerText(correctAnswerTexts);
        feedback.setSubmittedAnswerText(submittedAnswerTexts);
    }

    private void evaluateTrueFalse(AnswerSubmissionDTO submission, Question question, AnswerFeedbackDTO feedback) {
        Answer submittedAnswer = answerRepository.findById(submission.getAnswerId())
                .orElseThrow(() -> new EntityNotFoundException("Answer not found"));

        Answer correctAnswer = question.getAnswers().stream()
                .filter(Answer::isCorrect)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No correct answer found"));

        boolean isCorrect = submittedAnswer.isCorrect();

        feedback.setCorrectAnswer(isCorrect);
        feedback.setCorrectAnswerText(Collections.singletonList(correctAnswer.getAnswerText()));
        feedback.setSubmittedAnswerText(Collections.singletonList(submittedAnswer.getAnswerText()));
    }

    private void evaluateNumeric(AnswerSubmissionDTO submission, Question question, AnswerFeedbackDTO feedback) {
        try {
            double submittedValue = Double.parseDouble(submission.getTextAnswer());
            Answer correctAnswer = question.getAnswers().stream()
                    .filter(Answer::isCorrect)
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("No correct answer found"));

            double correctValue = Double.parseDouble(correctAnswer.getAnswerText());
            boolean isCorrect = Math.abs(submittedValue - correctValue) < 0.0001; // Allow small floating-point differences

            feedback.setCorrectAnswer(isCorrect);
            feedback.setCorrectAnswerText(Collections.singletonList(correctAnswer.getAnswerText()));
            feedback.setSubmittedAnswerText(Collections.singletonList(submission.getTextAnswer()));
        } catch (NumberFormatException e) {
            feedback.setCorrectAnswer(false);
            feedback.setSubmittedAnswerText(Collections.singletonList("Invalid number: " + submission.getTextAnswer()));
        }
    }

    private void evaluateFillInTheBlank(AnswerSubmissionDTO submission, Question question, AnswerFeedbackDTO feedback) {
        Answer correctAnswer = question.getAnswers().stream()
                .filter(Answer::isCorrect)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No correct answer found"));

        boolean isCorrect = submission.getTextAnswer() != null &&
                submission.getTextAnswer().trim().equalsIgnoreCase(correctAnswer.getAnswerText().trim());

        feedback.setCorrectAnswer(isCorrect);
        feedback.setCorrectAnswerText(Collections.singletonList(correctAnswer.getAnswerText()));
        feedback.setSubmittedAnswerText(Collections.singletonList(submission.getTextAnswer()));
    }

    private void evaluateEssay(AnswerSubmissionDTO submission, Question question, AnswerFeedbackDTO feedback) {
        // Store the essay answer without evaluation
        feedback.setCorrectAnswer(true); // Essays require manual grading
        feedback.setSubmittedAnswerText(Collections.singletonList(submission.getTextAnswer()));

        // Include model answer if available
        Optional<Answer> modelAnswer = question.getAnswers().stream()
                .filter(Answer::isCorrect)
                .findFirst();

        feedback.setCorrectAnswerText(Collections.singletonList(
                modelAnswer.map(Answer::getAnswerText)
                        .orElse("This essay requires manual grading.")
        ));
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
