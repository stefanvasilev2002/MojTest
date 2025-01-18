package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.*;
import com.finki.mojtest.model.dtos.*;
import com.finki.mojtest.repository.*;
import com.finki.mojtest.service.StudentTestService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor
public class StudentTestServiceImpl implements StudentTestService {
    private final StudentTestRepository studentTestRepository;
    private final StudentAnswerRepository studentAnswerRepository;
    private final AnswerRepository answerRepository;

    @Override
    public StudentTest createStudentTest(StudentTest studentTest) {
        studentTest.setDateTaken(LocalDate.now());
        studentTest.setTimeTaken(LocalTime.now());
        studentTest.setStartTime(LocalDateTime.now());

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
        if(question.getFormula() != null) {
            questionDTO.setFormula(question.getFormula());

        }

        List<AnswerDTO> answers = question.getAnswers().stream()
                .map(answer -> {
                    AnswerDTO answerDTO = new AnswerDTO();
                    answerDTO.setId(answer.getId());
                    answerDTO.setAnswerText(answer.getAnswerText());
                    return answerDTO;
                })
                .collect(Collectors.toList());
        Collections.shuffle(answers);
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

        int score = calculateScore(studentTest.getAnswers());
        studentTest.setScore(score);

        return studentTestRepository.save(studentTest);
    }

    @Override
    @Transactional
    public TestFeedbackDTO evaluateTest(Long studentTestId, List<AnswerSubmissionDTO> answers) {
        StudentTest studentTest = studentTestRepository.findById(studentTestId)
                .orElseThrow(() -> new EntityNotFoundException("Student test not found"));


        if (studentTest.getTimeTaken() == null) {
            throw new IllegalStateException("Test hasn't been started");
        }

        studentTest.setEndTime(LocalDateTime.now());

        Map<Long, AnswerSubmissionDTO> submissionMap = answers.stream()
                .collect(Collectors.toMap(
                        AnswerSubmissionDTO::getQuestionId,
                        submission -> submission
                ));

        TestFeedbackDTO feedback = new TestFeedbackDTO();
        feedback.setStudentTestId(studentTestId);
        List<AnswerFeedbackDTO> feedbackList = new ArrayList<>();
        double totalScore = 0;
        double maxPossibleScore = 0;

        Map<Long, List<StudentAnswer>> answersByQuestion = studentTest.getAnswers().stream()
                .collect(Collectors.groupingBy(sa -> sa.getTestQuestion().getQuestion().getId()));

        for (Map.Entry<Long, List<StudentAnswer>> entry : answersByQuestion.entrySet()) {
            List<StudentAnswer> questionAnswers = entry.getValue();
            StudentAnswer studentAnswer = questionAnswers.getFirst();
            Question question = studentAnswer.getTestQuestion().getQuestion();
            TestQuestion testQuestion = studentAnswer.getTestQuestion();
            maxPossibleScore += question.getPoints();

            AnswerFeedbackDTO answerFeedback = new AnswerFeedbackDTO();
            answerFeedback.setQuestionId(question.getId());
            answerFeedback.setQuestionText(question.getDescription());
            answerFeedback.setPoints(question.getPoints());

            AnswerSubmissionDTO submission = submissionMap.get(question.getId());

            boolean isCorrect = false;
            double earnedPoints = 0;

            if (submission == null) {
                answerFeedback.setSubmittedAnswerText(Collections.singletonList("No answer provided"));
                answerFeedback.setEarnedPoints(0);
                switch (question.getQuestionType()) {
                    case MULTIPLE_CHOICE, TRUE_FALSE, NUMERIC, FILL_IN_THE_BLANK -> {
                        List<String> correctAnswer = question.getAnswers().stream()
                                .filter(Answer::isCorrect)
                                .map(Answer::getAnswerText)
                                .toList();
                        answerFeedback.setCorrectAnswerText(correctAnswer);
                    }
                    case ESSAY -> {
                        String correctAnswerText = question.getAnswers().stream()
                                .filter(Answer::isCorrect)
                                .map(Answer::getAnswerText)
                                .collect(Collectors.joining(", "));
                        answerFeedback.setCorrectAnswerText(Collections.singletonList(correctAnswerText));
                    }
                }
            } else {
                switch (question.getQuestionType()) {
                    case MULTIPLE_CHOICE -> {
                        Set<Long> correctAnswerIds = question.getAnswers().stream()
                                .filter(Answer::isCorrect)
                                .map(Answer::getId)
                                .collect(Collectors.toSet());

                        List<Long> submittedAnswerIds = submission.getAnswerIds();

                        if (submittedAnswerIds != null && !submittedAnswerIds.isEmpty()) {
                            double pointsPerAnswer = (double) question.getPoints() / correctAnswerIds.size();
                            double negativePointsPerAnswer = question.getNegativePointsPerAnswer() == 0 ?
                                    pointsPerAnswer : question.getNegativePointsPerAnswer();

                            int correctSelections = 0;
                            for (Long answerId : submittedAnswerIds) {
                                if (correctAnswerIds.contains(answerId)) {
                                    correctSelections++;
                                    earnedPoints += pointsPerAnswer;
                                } else {
                                    earnedPoints -= negativePointsPerAnswer;
                                }
                            }

                            isCorrect = correctSelections == correctAnswerIds.size() &&
                                    submittedAnswerIds.size() == correctAnswerIds.size();

                            List<String> submittedAnswerTexts = question.getAnswers().stream()
                                    .filter(a -> submittedAnswerIds.contains(a.getId()))
                                    .map(Answer::getAnswerText)
                                    .collect(Collectors.toList());

                            List<String> correctAnswerTexts = question.getAnswers().stream()
                                    .filter(Answer::isCorrect)
                                    .map(Answer::getAnswerText)
                                    .collect(Collectors.toList());

                            answerFeedback.setSubmittedAnswerText(submittedAnswerTexts);
                            answerFeedback.setCorrectAnswerText(correctAnswerTexts);

                            studentAnswer.setChosenAnswer(
                                    answerRepository.findById(submittedAnswerIds.getFirst()).orElse(null)
                            );
                            studentAnswerRepository.save(studentAnswer);

                            if (submittedAnswerIds.size() > 1) {
                                for (int i = 1; i < submittedAnswerIds.size(); i++) {
                                    StudentAnswer additionalAnswer = new StudentAnswer();
                                    additionalAnswer.setStudentTest(studentTest);
                                    additionalAnswer.setTestQuestion(testQuestion);
                                    Answer chosenAnswer = answerRepository.findById(submittedAnswerIds.get(i)).orElse(null);
                                    additionalAnswer.setChosenAnswer(chosenAnswer);
                                    studentAnswerRepository.save(additionalAnswer);
                                }
                            }
                        }
                    }
                    case TRUE_FALSE -> {
                        List<Long> trueFalseAnswerIds = submission.getAnswerIds();
                        if (trueFalseAnswerIds != null && !trueFalseAnswerIds.isEmpty()) {
                            Long trueFalseAnswerId = trueFalseAnswerIds.getFirst();
                            Answer chosenTrueFalseAnswer = question.getAnswers().stream()
                                    .filter(a -> a.getId().equals(trueFalseAnswerId))
                                    .findFirst()
                                    .orElse(null);

                            if (chosenTrueFalseAnswer != null) {
                                isCorrect = chosenTrueFalseAnswer.isCorrect();
                                earnedPoints = isCorrect ? question.getPoints() : -question.getNegativePointsPerAnswer();

                                Answer correctAnswer = question.getAnswers().stream()
                                        .filter(Answer::isCorrect)
                                        .findFirst()
                                        .orElseThrow(() -> new IllegalStateException("No correct answer found"));

                                answerFeedback.setSubmittedAnswerText(Collections.singletonList(chosenTrueFalseAnswer.getAnswerText()));
                                answerFeedback.setCorrectAnswerText(Collections.singletonList(correctAnswer.getAnswerText()));

                                studentAnswer.setChosenAnswer(chosenTrueFalseAnswer);
                                studentAnswerRepository.save(studentAnswer);
                            }
                        }
                    }
                    case NUMERIC -> {
                        String submittedValue = submission.getTextAnswer();
                        Answer numericAnswer = question.getAnswers().stream()
                                .filter(Answer::isCorrect)
                                .findFirst()
                                .orElseThrow(() -> new IllegalStateException("No correct answer found"));

                        try {
                            double submittedNumber = Double.parseDouble(submittedValue);
                            double correctNumber = Double.parseDouble(numericAnswer.getAnswerText());
                            double tolerance = 0.001;

                            isCorrect = Math.abs(submittedNumber - correctNumber) <= tolerance;
                            earnedPoints = isCorrect ? question.getPoints() : -question.getNegativePointsPerAnswer();

                            answerFeedback.setSubmittedAnswerText(Collections.singletonList(submittedValue));
                            answerFeedback.setCorrectAnswerText(Collections.singletonList(numericAnswer.getAnswerText()));

                            studentAnswer.setSubmittedValue(submittedValue);
                            studentAnswer.setChosenAnswer(numericAnswer);
                            studentAnswerRepository.save(studentAnswer);
                        } catch (NumberFormatException e) {
                            isCorrect = false;
                            earnedPoints = -question.getNegativePointsPerAnswer();
                            answerFeedback.setSubmittedAnswerText(Collections.singletonList("Invalid number format"));
                            answerFeedback.setCorrectAnswerText(Collections.singletonList(numericAnswer.getAnswerText()));
                        }
                    }
                    case ESSAY -> {
                        String essayAnswer = submission.getTextAnswer();
                        answerFeedback.setSubmittedAnswerText(Collections.singletonList(essayAnswer));
                        answerFeedback.setCorrectAnswerText(
                                question.getAnswers().stream()
                                        .filter(Answer::isCorrect)
                                        .map(Answer::getAnswerText)
                                        .collect(Collectors.toList())
                        );
                        earnedPoints = essayAnswer != null && !essayAnswer.trim().isEmpty() ?
                                question.getPoints() : 0;
                        isCorrect = earnedPoints > 0;

                        studentAnswer.setSubmittedValue(essayAnswer);
                        studentAnswer.setChosenAnswer(question.getAnswers().stream()
                                .filter(Answer::isCorrect)
                                .findFirst()
                                .orElseThrow(() -> new IllegalStateException("No correct answer found")));
                        studentAnswerRepository.save(studentAnswer);
                    }
                    case FILL_IN_THE_BLANK -> {
                        String submittedText = submission.getTextAnswer().trim().toLowerCase();
                        Answer fillInBlankAnswer = question.getAnswers().stream()
                                .filter(Answer::isCorrect)
                                .findFirst()
                                .orElseThrow(() -> new IllegalStateException("No correct answer found"));

                        List<String> validAnswers = Arrays.stream(fillInBlankAnswer.getAnswerText().split(","))
                                .map(String::trim)
                                .map(String::toLowerCase)
                                .collect(Collectors.toList());

                        isCorrect = validAnswers.contains(submittedText);
                        earnedPoints = isCorrect ? question.getPoints() : -question.getNegativePointsPerAnswer();

                        answerFeedback.setSubmittedAnswerText(Collections.singletonList(submission.getTextAnswer()));
                        answerFeedback.setCorrectAnswerText(validAnswers);

                        studentAnswer.setSubmittedValue(submittedText);
                        studentAnswer.setChosenAnswer(fillInBlankAnswer);
                        studentAnswerRepository.save(studentAnswer);
                    }
                }
            }

            answerFeedback.setCorrectAnswer(isCorrect);
            answerFeedback.setEarnedPoints(earnedPoints);
            feedbackList.add(answerFeedback);
            totalScore += earnedPoints;
        }

        studentTest.setScore((int) Math.max(totalScore, 0));
        studentTestRepository.save(studentTest);

        feedback.setTotalScore((int) Math.max(totalScore, 0));
        feedback.setMaxScore((int) maxPossibleScore);
        feedback.setAnswerFeedbackList(feedbackList);

        return feedback;
    }
    @Override
    public Page<TestAttemptDTO> getTestAttempts(Long testId, Long studentId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("dateTaken").descending()
                .and(Sort.by("timeTaken").descending()));

        Page<StudentTest> studentTests = studentTestRepository.findByTestIdAndStudentId(testId, studentId, pageable);

        return studentTests.map(studentTest -> {
            Map<Long, Question> questionMap = studentTest.getAnswers().stream()
                    .collect(Collectors.toMap(
                            sa -> sa.getTestQuestion().getQuestion().getId(),
                            sa -> sa.getTestQuestion().getQuestion(),
                            (existing, replacement) -> existing // Keep first occurrence
                    ));

            int totalPoints = questionMap.values().stream()
                    .mapToInt(Question::getPoints)
                    .sum();

            return new TestAttemptDTO(
                    studentTest.getId(),
                    studentTest.getScore(),
                    totalPoints,
                    studentTest.getDateTaken(),
                    studentTest.getTimeTaken()
            );
        });
    }

    @Override
    @Transactional
    public TestResultsDTO getTestResults(Long studentTestId) {
        StudentTest studentTest = studentTestRepository.findById(studentTestId)
                .orElseThrow(() -> new EntityNotFoundException("Student test not found"));

        List<QuestionResultDTO> questionResults = new ArrayList<>();
        double totalPoints = 0;

        Map<Long, List<StudentAnswer>> answersByQuestion = studentTest.getAnswers().stream()
                .collect(Collectors.groupingBy(sa -> sa.getTestQuestion().getQuestion().getId()));

        for (Map.Entry<Long, List<StudentAnswer>> entry : answersByQuestion.entrySet()) {
            List<StudentAnswer> questionAnswers = entry.getValue();
            StudentAnswer firstAnswer = questionAnswers.getFirst();
            Question question = firstAnswer.getTestQuestion().getQuestion();
            totalPoints += question.getPoints();

            String studentAnswerText;
            String correctAnswerText;
            double earnedPoints = 0;

            switch (question.getQuestionType()) {
                case MULTIPLE_CHOICE -> {
                    Set<Long> correctAnswerIds = question.getAnswers().stream()
                            .filter(Answer::isCorrect)
                            .map(Answer::getId)
                            .collect(Collectors.toSet());

                    List<Answer> chosenAnswers = questionAnswers.stream()
                            .map(StudentAnswer::getChosenAnswer)
                            .filter(Objects::nonNull)
                            .toList();

                    if (!chosenAnswers.isEmpty()) {
                        List<String> submittedAnswerTextList = chosenAnswers.stream()
                                .map(Answer::getAnswerText)
                                .collect(Collectors.toList());
                        studentAnswerText = String.join(", ", submittedAnswerTextList);

                        double pointsPerAnswer = (double) question.getPoints() / correctAnswerIds.size();
                        double negativePointsPerAnswer = question.getNegativePointsPerAnswer() == 0 ?
                                pointsPerAnswer : question.getNegativePointsPerAnswer();

                        for (Answer answer : chosenAnswers) {
                            if (correctAnswerIds.contains(answer.getId())) {
                                earnedPoints += pointsPerAnswer;
                            } else {
                                earnedPoints -= negativePointsPerAnswer;
                            }
                        }
                    } else {
                        studentAnswerText = "No answer provided";
                    }

                    correctAnswerText = question.getAnswers().stream()
                            .filter(Answer::isCorrect)
                            .map(Answer::getAnswerText)
                            .collect(Collectors.joining(", "));
                }
                case TRUE_FALSE -> {
                    if (firstAnswer.getChosenAnswer() != null) {
                        studentAnswerText = firstAnswer.getChosenAnswer().getAnswerText();
                        correctAnswerText = question.getAnswers().stream()
                                .filter(Answer::isCorrect)
                                .map(Answer::getAnswerText)
                                .findFirst()
                                .orElse("N/A");

                        earnedPoints = firstAnswer.getChosenAnswer().isCorrect() ?
                                question.getPoints() : -question.getNegativePointsPerAnswer();
                    } else {
                        studentAnswerText = "No answer provided";
                        correctAnswerText = question.getAnswers().stream()
                                .filter(Answer::isCorrect)
                                .map(Answer::getAnswerText)
                                .findFirst()
                                .orElse("N/A");
                    }
                }
                case NUMERIC -> {
                    studentAnswerText = firstAnswer.getSubmittedValue() != null ?
                            firstAnswer.getSubmittedValue() : "No answer provided";

                    Answer correctAnswer = question.getAnswers().stream()
                            .filter(Answer::isCorrect)
                            .findFirst()
                            .orElseThrow(() -> new IllegalStateException("No correct answer found"));
                    correctAnswerText = correctAnswer.getAnswerText();

                    if (firstAnswer.getSubmittedValue() != null) {
                        try {
                            double submittedNumber = Double.parseDouble(firstAnswer.getSubmittedValue());
                            double correctNumber = Double.parseDouble(correctAnswer.getAnswerText());
                            double tolerance = 0.001;

                            earnedPoints = Math.abs(submittedNumber - correctNumber) <= tolerance ?
                                    question.getPoints() : -question.getNegativePointsPerAnswer();
                        } catch (NumberFormatException e) {
                            earnedPoints = -question.getNegativePointsPerAnswer();
                        }
                    }
                }
                case FILL_IN_THE_BLANK -> {
                    studentAnswerText = firstAnswer.getSubmittedValue() != null ?
                            firstAnswer.getSubmittedValue() : "No answer provided";

                    Answer correctAnswer = question.getAnswers().stream()
                            .filter(Answer::isCorrect)
                            .findFirst()
                            .orElseThrow(() -> new IllegalStateException("No correct answer found"));

                    List<String> validAnswers = Arrays.stream(correctAnswer.getAnswerText().split(","))
                            .map(String::trim)
                            .map(String::toLowerCase)
                            .toList();

                    correctAnswerText = correctAnswer.getAnswerText();

                    if (firstAnswer.getSubmittedValue() != null) {
                        String submittedText = firstAnswer.getSubmittedValue().trim().toLowerCase();
                        earnedPoints = validAnswers.contains(submittedText) ?
                                question.getPoints() : -question.getNegativePointsPerAnswer();
                    }
                }
                case ESSAY -> {
                    studentAnswerText = firstAnswer.getSubmittedValue() != null ?
                            firstAnswer.getSubmittedValue() : "No answer provided";
                    correctAnswerText = question.getAnswers().stream()
                            .filter(Answer::isCorrect)
                            .map(Answer::getAnswerText)
                            .findFirst()
                            .orElse("N/A");
                    if (firstAnswer.getSubmittedValue() != null){
                        earnedPoints = question.getPoints();
                    }
                    else {
                        earnedPoints = 0;
                    }
                }
                default -> {
                    studentAnswerText = "Unsupported question type";
                    correctAnswerText = "Unsupported question type";
                }
            }

            if (earnedPoints < 0 && Math.abs(earnedPoints) > question.getPoints()) {
                earnedPoints = -question.getPoints();
            }

            QuestionResultDTO questionResult = QuestionResultDTO.builder()
                    .questionId(question.getId())
                    .description(question.getDescription())
                    .questionType(question.getQuestionType().toString())
                    .points(question.getPoints())
                    .earnedPoints(earnedPoints)
                    .studentAnswer(studentAnswerText)
                    .correctAnswer(correctAnswerText)
                    .imageId(question.getImage() != null ? question.getImage().getId() : null)
                    .build();

            questionResults.add(questionResult);
        }

        double score = questionResults.stream()
                .mapToDouble(QuestionResultDTO::getEarnedPoints)
                .sum();

        double scorePercentage = totalPoints > 0 ? (score * 100.0) / totalPoints : 0;

        if (scorePercentage < 0) {
            scorePercentage = 0;
        }
        if(score < 0) {
            score = 0;
        }
        return TestResultsDTO.builder()
                .studentTestId(studentTestId)
                .testTitle(studentTest.getTest().getTitle())
                .questions(questionResults)
                .score(score)
                .totalPoints(totalPoints)
                .scorePercentage(scorePercentage)
                .build();
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
