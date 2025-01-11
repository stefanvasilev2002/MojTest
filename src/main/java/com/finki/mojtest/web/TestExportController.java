package com.finki.mojtest.web;

import com.finki.mojtest.service.TestExportService;
import com.finki.mojtest.service.TestService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.finki.mojtest.model.Test;

@RestController
@RequestMapping("/api/export")
public class TestExportController {

    private final TestExportService exportService;
    private final TestService testService;

    public TestExportController(TestExportService exportService, TestService testService) {
        this.exportService = exportService;
        this.testService = testService;
    }

    @GetMapping("/{testId}")
    public ResponseEntity<ByteArrayResource> exportTest(
            @PathVariable Long testId,
            @RequestParam String format) {

        Test test = testService.getTestById(testId);
        if (test == null) {
            return ResponseEntity.notFound().build();
        }

        // Let the service handle the export with proper headers
        return switch (format.toLowerCase()) {
            case "pdf" -> exportService.generatePDF(test);
            case "docx" -> exportService.generateWord(test);
            default -> ResponseEntity.badRequest().build();
        };
    }
}