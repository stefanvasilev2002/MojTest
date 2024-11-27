package com.finki.mojtest.service.impl;
import com.finki.mojtest.model.Metadata;
import com.finki.mojtest.repository.MetadataRepository;
import com.finki.mojtest.service.MetadataService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MetadataServiceImpl implements MetadataService {
    private final MetadataRepository metadataRepository;

    public MetadataServiceImpl(MetadataRepository metadataRepository) {
        this.metadataRepository = metadataRepository;
    }

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
}