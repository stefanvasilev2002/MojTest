package com.finki.mojtest.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;

public interface FileStorageService {
    String storeFile(MultipartFile file) throws IOException;
    Resource loadFileAsResource(String filePath) throws MalformedURLException;
    void deleteFile(String filePath) throws IOException;
    String updateFile(MultipartFile newFile, String existingFileName) throws IOException;
}
