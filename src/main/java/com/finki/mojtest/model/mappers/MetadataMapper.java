package com.finki.mojtest.model.mappers;

import com.finki.mojtest.model.Metadata;
import com.finki.mojtest.model.Question;
import com.finki.mojtest.model.Test;
import com.finki.mojtest.model.dtos.MetadataDTO;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class MetadataMapper {

    public static MetadataDTO toDTO(Metadata metadata) {
        if (metadata == null) return null;

        MetadataDTO dto = new MetadataDTO();
        dto.setId(metadata.getId());
        dto.setKey(metadata.getKey());
        dto.setValue(metadata.getValue());

        dto.setQuestionIds(metadata.getQuestions() != null
                ? metadata.getQuestions().stream().map(Question::getId).collect(Collectors.toList())
                : Collections.emptyList());

        dto.setTestIds(metadata.getTests() != null
                ? metadata.getTests().stream().map(Test::getId).collect(Collectors.toList())
                : Collections.emptyList());

        return dto;
    }

    public static Metadata fromDTO(MetadataDTO dto, List<Question> questions, List<Test> tests) {
        if (dto == null) return null;

        Metadata metadata = new Metadata();
        metadata.setId(dto.getId());
        metadata.setKey(dto.getKey());
        metadata.setValue(dto.getValue());

        metadata.setQuestions(questions != null ? questions : Collections.emptyList());
        metadata.setTests(tests != null ? tests : Collections.emptyList());

        return metadata;
    }

    public static void updateFromDTO(Metadata existingMetadata, MetadataDTO dto, List<Question> questions, List<Test> tests) {
        if (existingMetadata == null || dto == null) return;

        existingMetadata.setKey(dto.getKey());
        existingMetadata.setValue(dto.getValue());

        existingMetadata.setQuestions(questions != null ? questions : Collections.emptyList());
        existingMetadata.setTests(tests != null ? tests : Collections.emptyList());
    }
}

