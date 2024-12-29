package com.finki.mojtest.repository;

import com.finki.mojtest.model.File;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileRepository extends JpaRepository<File,Long> {
}
