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

        // Resolve the metadata entities using metadataIds (handle null or empty list)
        List<Metadata> metadataList = (questionDTO.getMetadataIds() != null && !questionDTO.getMetadataIds().isEmpty()) ?
                metadataRepository.findAllById(questionDTO.getMetadataIds()) :
                Collections.emptyList();  // If null or empty, use an empty list

        // Resolve the test entities using testIds (handle null or empty list)
        List<Test> testList = (questionDTO.getTestIds() != null && !questionDTO.getTestIds().isEmpty()) ?
                testRepository.findAllById(questionDTO.getTestIds()) :
                Collections.emptyList();  // If null or empty, use an empty list

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
    public Question updateQuestion(Long id, QuestionDTO questionDTO) {
        // Fetch the existing question
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
        QuestionMapper.updateFromDTO(existingQuestion, questionDTO, creator, tests, metadata, new Date());

        // Save and return the updated entity
        return questionRepository.save(existingQuestion);
    }


    @Transactional
    @Override
    public void deleteQuestion(Long id) {
        Question question = getQuestionById(id);

        // Remove the question from the tests' question bank (Many-to-Many relationship)
        for (Test test : question.getTests()) {
            test.getQuestionBank().remove(question);
        }

        // Delete all answers associated with the question
        List<Answer> answers = question.getAnswers();
        answerRepository.deleteAll(answers);

        // Finally, delete the question
        questionRepository.deleteById(id);
    }

    @Override
    public List<Question> getQuestionsByTestId(Long testId) {
        return questionRepository.findByTestId(testId);
    }
}