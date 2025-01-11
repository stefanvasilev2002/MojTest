package com.finki.mojtest.service;
import com.finki.mojtest.model.Test;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;

public interface TestExportService {
    public ResponseEntity<ByteArrayResource> generatePDF(Test test);
    public ResponseEntity<ByteArrayResource> generateWord(Test test);
}