package com.finki.mojtest.service.impl;

import com.finki.mojtest.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class LocalFileStorageServiceImpl implements FileStorageService {

    private final Path fileStorageLocation;

    @Autowired
    public LocalFileStorageServiceImpl(@Value("${file.upload-dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @Override
    public String storeFile(MultipartFile file) throws IOException {
        String fileName = System.currentTimeMillis() + "_" + StringUtils.cleanPath(file.getOriginalFilename());

        try {
            // Check if the fileName contains invalid characters
            if (fileName.contains("..")) {
                throw new RuntimeException("Filename contains invalid path sequence " + fileName);
            }

            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName, ex);
        }
    }

    // Rest of your methods remain the same but use this.fileStorageLocation instead of Paths.get(uploadDir)
    @Override
    public Resource loadFileAsResource(String fileName) throws MalformedURLException {
        Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists() && resource.isReadable()) {
            return resource;
        } else {
            throw new RuntimeException("File not found " + fileName);
        }
    }

    @Override
    public void deleteFile(String fileName) throws IOException {
        Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
        Files.deleteIfExists(filePath);
    }

    @Override
    public String updateFile(MultipartFile newFile, String existingFileName) throws IOException {
        // Delete the existing file if it exists
        Path existingFilePath = this.fileStorageLocation.resolve(existingFileName).normalize();
        Files.deleteIfExists(existingFilePath);

        // Store the new file with the same name
        Path targetLocation = this.fileStorageLocation.resolve(existingFileName);
        Files.copy(newFile.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        return existingFileName;
    }
}