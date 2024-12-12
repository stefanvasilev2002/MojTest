package com.finki.mojtest.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FileDTO {
    private Long id;
    private MultipartFile file;
    private String filePath;
    private Date uploadedAt;
    private String fileName;               // File name (if needed separately)
    private String fileType;               // MIME type
    private Long relatedEntityId;          // ID of the related entity, e.g., Product ID
}
