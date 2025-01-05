package com.finki.mojtest.service.impl;

import com.finki.mojtest.service.FileStorageService;
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

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Override
    public String storeFile(MultipartFile file) throws IOException {
        // Generate unique file name
        String fileName = System.currentTimeMillis() + "_" + StringUtils.cleanPath(file.getOriginalFilename());

        // Ensure upload directory exists
        Path fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(fileStorageLocation);

        // Store file
        Path targetLocation = fileStorageLocation.resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }

    @Override
    public Resource loadFileAsResource(String fileName) throws MalformedURLException {
        Path filePath = Paths.get(uploadDir).resolve(fileName).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists() && resource.isReadable()) {
            return resource;
        } else {
            throw new RuntimeException("File not found " + fileName);
        }
    }

    @Override
    public void deleteFile(String fileName) throws IOException {
        Path filePath = Paths.get(uploadDir).resolve(fileName).normalize();
        Files.deleteIfExists(filePath);
    }

    @Override
    public String updateFile(MultipartFile newFile, String existingFileName) throws IOException {
        Path fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(fileStorageLocation);

        // Resolve path to the existing file
        Path existingFilePath = fileStorageLocation.resolve(existingFileName).normalize();

        // Delete the existing file if it exists
        Files.deleteIfExists(existingFilePath);

        // Store the new file with the same name
        Path targetLocation = fileStorageLocation.resolve(existingFileName);
        Files.copy(newFile.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        return existingFileName;
    }
}
