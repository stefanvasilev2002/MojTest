package com.finki.mojtest.service.impl;
import com.finki.mojtest.model.Metadata;
import com.finki.mojtest.model.Question;
import com.finki.mojtest.model.Test;
import com.finki.mojtest.model.dtos.MetadataDTO;
import com.finki.mojtest.model.mappers.MetadataMapper;
import com.finki.mojtest.repository.MetadataRepository;
import com.finki.mojtest.repository.QuestionRepository;
import com.finki.mojtest.repository.TestRepository;
import com.finki.mojtest.service.MetadataService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MetadataServiceImpl implements MetadataService {
    private final MetadataRepository metadataRepository;
    private final QuestionRepository questionRepository;
    private final TestRepository testRepository;

    @Override
    public Metadata createMetadata(Metadata metadata) {
        if (metadata.getKey() == null || metadata.getKey().isEmpty()) {
            throw new IllegalArgumentException("Metadata key cannot be empty.");
        }
        return metadataRepository.save(metadata);
    }

    @Override
    public Metadata getMetadataById(Long id) {
        return metadataRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Metadata not found"));
    }

    @Override
    public List<Metadata> getAllMetadata() {
        return metadataRepository.findAll();
    }

    @Override
    public Metadata updateMetadata(Long id, Metadata updatedMetadata) {
        Metadata metadata = getMetadataById(id);

        if (updatedMetadata.getKey() != null) {
            metadata.setKey(updatedMetadata.getKey());
        }
        if (updatedMetadata.getValue() != null) {
            metadata.setValue(updatedMetadata.getValue());
        }

        return metadataRepository.save(metadata);
    }

    @Override
    public void deleteMetadata(Long id) {
        Metadata metadata = getMetadataById(id);

        if (!metadata.getQuestions().isEmpty() || !metadata.getTests().isEmpty()) {
            throw new RuntimeException("Metadata cannot be deleted because it is associated with questions or tests.");
        }

        metadataRepository.deleteById(id);
    }

    @Override
    public List<Metadata> getMetadataByKey(String key) {
        return metadataRepository.findByKey(key);
    }

    @Override
    public Metadata createMetadataByDTO(MetadataDTO dto) {
        if (dto.getKey() == null || dto.getKey().isEmpty()) {
            throw new IllegalArgumentException("Metadata key cannot be empty.");
        }
        List<Question> questions = questionRepository.findAllById(dto.getQuestionIds());
        List<Test> tests = testRepository.findAllById(dto.getTestIds());

        Metadata metadata = MetadataMapper.fromDTO(dto,questions,tests);
        return metadataRepository.save(metadata);
    }
}