package com.finki.mojtest.service;

import com.finki.mojtest.model.Metadata;

import java.util.List;

public interface MetadataService {
    Metadata createMetadata(Metadata metadata);
    Metadata getMetadataById(Long id);
    List<Metadata> getAllMetadata();
    Metadata updateMetadata(Long id, Metadata updatedMetadata);
    void deleteMetadata(Long id);
    List<Metadata> getMetadataByKey(String key);
}
