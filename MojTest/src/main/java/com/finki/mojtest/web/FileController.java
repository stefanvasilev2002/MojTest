package com.finki.mojtest.web;

import com.finki.mojtest.model.File;
import com.finki.mojtest.model.dtos.UploadFileResponse;
import com.finki.mojtest.repository.FileRepository;
import com.finki.mojtest.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.Date;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/files")
public class FileController {
    private final FileStorageService fileStorageService;
    private final FileRepository fileRepository; // Assuming you have a repository for File entity

    @PostMapping("/upload")
    public ResponseEntity<UploadFileResponse> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            // Store the file using the service, which will generate a unique name
            String storedFileName = fileStorageService.storeFile(file); // Unique filename generated here

            // Create a new File entity with minimal information
            File newFile = File.builder()
                    .filePath(storedFileName) // Store the unique filename
                    .fileName(storedFileName) // Use the stored filename
                    .fileType(file.getContentType())
                    .uploadedAt(new Date())
                    .build();

            // Save the file entity to the database
            File savedFile = fileRepository.save(newFile); // Save and get the saved entity

            // Create response with the stored file information, including the ID
            UploadFileResponse response = new UploadFileResponse(
                    savedFile.getId(),             // Set the file ID
                    storedFileName,
                    storedFileName,
                    file.getContentType(),
                    file.getSize()
            );

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            // Handle the IOException
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new UploadFileResponse(null, "File upload failed", null, null, 0));
        }
    }

    @PostMapping("/uploadWithCategory")
    public ResponseEntity<UploadFileResponse> uploadFile(@RequestParam("file") MultipartFile file,
                                                         @RequestParam(required = false) Long relatedEntityId) {
        try {
            // Store the file using the service, which will generate a unique name
            String storedFileName = fileStorageService.storeFile(file); // Unique filename generated here

            // Create a new File entity
            File newFile = File.builder()
                    .filePath(storedFileName) // Store the unique filename
                    .fileName(storedFileName) // Use the stored filename
                    .fileType(file.getContentType())
                    .uploadedAt(new Date())
                    .relatedEntityId(relatedEntityId) // Set the related entity ID, if provided
                    .build();

            // Save the file entity to the database
            File savedFile = fileRepository.save(newFile);

            // Include the ID in the response
            UploadFileResponse response = new UploadFileResponse(
                    savedFile.getId(),              // Set the file ID
                    storedFileName,
                    storedFileName,
                    file.getContentType(),
                    file.getSize()
            );

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            // Handle the IOException
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new UploadFileResponse(null, "File upload failed", null, null, 0));
        }
    }


    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        File fileEntity = fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found with id: " + id));

        try {
            Resource resource = fileStorageService.loadFileAsResource(fileEntity.getFilePath());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error loading file: " + fileEntity.getFileName(), e);
        }
    }

    @GetMapping("/download/{id}/inline")
    public ResponseEntity<Resource> downloadFileInline(@PathVariable Long id) {
        File fileEntity = fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found with id: " + id));

        try {
            Resource resource = fileStorageService.loadFileAsResource(fileEntity.getFilePath());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error loading file: " + fileEntity.getFileName(), e);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteFile(@PathVariable Long id) throws IOException {
        File fileEntity = fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found with id: " + id));
        fileStorageService.deleteFile(fileEntity.getFileName());
        fileRepository.delete(fileEntity);
        return ResponseEntity.ok("File deleted successfully.");

    }

    @PutMapping("/update/{id}")
    public ResponseEntity<UploadFileResponse> updateFile(@PathVariable Long id, @RequestParam("file") MultipartFile newFile) {
        File fileEntity = fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found with id: " + id));

        try {
            // Update the file using the service and get the new filename
            String updatedFileName = fileStorageService.updateFile(newFile, fileEntity.getFileName());

            // Optionally update other fields if needed
            fileEntity.setFileName(updatedFileName); // Update the filename in the entity
            fileRepository.save(fileEntity); // Save updated entity

            // Create response including the ID of the updated file
            UploadFileResponse response = new UploadFileResponse(
                    fileEntity.getId(),             // Set the file ID
                    updatedFileName,
                    fileEntity.getFilePath(),
                    fileEntity.getFileType(),
                    newFile.getSize()
            );

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            throw new RuntimeException("Error updating file: " + fileEntity.getFileName(), e);
        }
    }
}
