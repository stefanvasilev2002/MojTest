package com.finki.mojtest.repository;

import com.finki.mojtest.model.Metadata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MetadataRepository extends JpaRepository<Metadata, Long> {
}
