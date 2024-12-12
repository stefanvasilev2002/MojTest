package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.*;
import com.finki.mojtest.model.dtos.QuestionDTO;
import com.finki.mojtest.model.mappers.FileMapper;
import com.finki.mojtest.model.mappers.QuestionMapper;
import com.finki.mojtest.model.users.Teacher;
import com.finki.mojtest.repository.*;
import com.finki.mojtest.repository.users.TeacherRepository;
import com.finki.mojtest.service.QuestionService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final TeacherRepository teacherRepository;
    private final MetadataRepository metadataRepository;
    private final TestRepository testRepository;
    private final FileRepository fileRepository;
    @Override
    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }

    @Override
    public Question createQuestionByDTO(QuestionDTO questionDTO) {
        Question question = QuestionMapper.fromDTO(questionDTO, null,null, null, null,null,null); // No relationships mapped yet

        File image = null;
        if(questionDTO.getImage()!=null){
            image = fileRepository.findById(questionDTO.getImage().getId()).orElse(null);
            image = FileMapper.updateFromDto(image,questionDTO.getImage(),new Date());
        }
        question.setImage(image);
        Teacher creator = teacherRepository.findById(questionDTO.getCreatorId())
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found"));

        // Save the Question first to get an ID
        question = questionRepository.save(question);

        // Create and save the answers if they exist
        if (questionDTO.getAnswers() != null && !questionDTO.getAnswers().isEmpty()) {
            Question finalQuestion = question;
            List<Answer> answers = questionDTO.getAnswers().stream()
                    .map(answerDTO -> {
                        Answer answer = new Answer();
                        answer.setAnswerText(answerDTO.getAnswerText());
                        answer.setQuestion(finalQuestion);
                        return answer;
                    })
                    .collect(Collectors.toList());
            answers = answerRepository.saveAll(answers);
            question.setAnswers(answers);

        }
        // Set the resolved relationships on the Question entity
        question.setCreator(creator); // Set the Teacher (creator) to the Question
        question.setMetadata(metadataList); // Set the Metadata to the Question
        question.setTests(testList); // Set the Tests to the Question
        question = questionRepository.save(question);

        // manually setting the related entity id to the file
        if(image != null){
            image.setRelatedEntityId(question.getId());
            fileRepository.save(image);
        }

        return question;
    }


    @Override
    public Question getQuestionById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
    }

    @Override
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    @Override
    @Transactional
    public Question updateQuestion(Long id, QuestionDTO questionDTO) {
        Question existingQuestion = getQuestionById(id);

        // Resolve related entities
        Teacher creator = teacherRepository.findById(questionDTO.getCreatorId())
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found"));

        List<Test> tests = (questionDTO.getTestIds() != null && !questionDTO.getTestIds().isEmpty()) ?
                testRepository.findAllById(questionDTO.getTestIds()) :
                Collections.emptyList();

        List<Metadata> metadata = (questionDTO.getMetadataIds() != null && !questionDTO.getMetadataIds().isEmpty()) ?
                metadataRepository.findAllById(questionDTO.getMetadataIds()) :
                Collections.emptyList();

        // Use the mapper to update the existing entity
        QuestionMapper.updateFromDTO(existingQuestion, questionDTO, creator, tests, metadata);
        existingQuestion.setDescription(questionDTO.getDescription());

        if (questionDTO.getAnswers() != null) {
            // Remove old answers
            answerRepository.deleteAll(existingQuestion.getAnswers());

            // Create new answers
            List<Answer> newAnswers = questionDTO.getAnswers().stream()
                    .map(answerDTO -> {
                        Answer answer = new Answer();
                        answer.setAnswerText(answerDTO.getAnswerText());
                        answer.setQuestion(existingQuestion);
                        return answer;
                    })
                    .collect(Collectors.toList());

            existingQuestion.setAnswers(answerRepository.saveAll(newAnswers));
        }
        // Save and return the updated entity
        return questionRepository.save(existingQuestion);
    }


    @Transactional
    @Override
    public void deleteQuestion(Long id) {
        Question question = getQuestionById(id);

        // Delete associated answers
        answerRepository.deleteAll(question.getAnswers());

        // Delete the question
        questionRepository.delete(question);
    }

    @Override
    public List<Question> getQuestionsByTestId(Long testId) {
        return questionRepository.findByTestId(testId);
    }
}