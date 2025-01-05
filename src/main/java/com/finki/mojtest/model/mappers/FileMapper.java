package com.finki.mojtest.model.mappers;

import com.finki.mojtest.model.File;
import com.finki.mojtest.model.dtos.FileDTO;

import java.util.Date;

public class FileMapper {
    public static FileDTO toDto(File file) {
        if (file == null) {
            return null;
        }

        FileDTO fileDTO = new FileDTO();
        fileDTO.setId(file.getId());
        fileDTO.setFilePath(file.getFilePath());
        fileDTO.setUploadedAt(file.getUploadedAt());
        fileDTO.setFileName(file.getFileName());
        fileDTO.setFileType(file.getFileType());
        fileDTO.setRelatedEntityId(file.getRelatedEntityId());
        return fileDTO;
    }

    public static File toEntityFromDto(FileDTO fileDTO, Date uploadedAt) {
        if (fileDTO == null) {
            return null;
        }

        return File.builder()
                .id(fileDTO.getId())
                .filePath(fileDTO.getFilePath())
                .uploadedAt(uploadedAt != null ? uploadedAt : fileDTO.getUploadedAt())
                .fileName(fileDTO.getFileName())
                .fileType(fileDTO.getFileType())
                .relatedEntityId(fileDTO.getRelatedEntityId())
                .build();
    }

    public static File updateFromDto(File file, FileDTO fileDTO, Date uploadedAt) {
        if (file == null || fileDTO == null) {
            return file;
        }

        if (fileDTO.getFilePath() != null) {
            file.setFilePath(fileDTO.getFilePath());
        }
        if (fileDTO.getUploadedAt() != null || uploadedAt != null) {
            file.setUploadedAt(uploadedAt != null ? uploadedAt : fileDTO.getUploadedAt());
        }
        if (fileDTO.getFileName() != null) {
            file.setFileName(fileDTO.getFileName());
        }
        if (fileDTO.getFileType() != null) {
            file.setFileType(fileDTO.getFileType());
        }
        if (fileDTO.getRelatedEntityId() != null) {
            file.setRelatedEntityId(fileDTO.getRelatedEntityId());
        }

        return file;
    }
}
