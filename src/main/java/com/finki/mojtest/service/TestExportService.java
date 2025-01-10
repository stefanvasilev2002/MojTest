package com.finki.mojtest.service;
import com.finki.mojtest.model.Test;
import org.springframework.core.io.ByteArrayResource;

public interface TestExportService {
    public ByteArrayResource generatePDF(Test test);
    public ByteArrayResource generateWord(Test test);
}