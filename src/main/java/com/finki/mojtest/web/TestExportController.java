package com.finki.mojtest.web;

import com.finki.mojtest.service.TestExportService;
import com.finki.mojtest.service.TestService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
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

        // Get test from database
        Test test = testService.getTestById(testId);

        if (test == null) {
            return ResponseEntity.notFound().build();
        }

        String filename = test.getTitle().replaceAll("\\s+", "_");
        ByteArrayResource resource;
        String contentType;

        if ("pdf".equalsIgnoreCase(format)) {
            resource = exportService.generatePDF(test);
            contentType = "application/pdf";
            filename += ".pdf";
        } else if ("docx".equalsIgnoreCase(format)) {
            resource = exportService.generateWord(test);
            contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            filename += ".docx";
        } else {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }
}