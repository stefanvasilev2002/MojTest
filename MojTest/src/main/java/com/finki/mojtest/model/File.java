package com.finki.mojtest.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filePath;      // Path on disk or URL for S3
    private String fileName;      // Name of the file
    private String fileType;      // MIME type, e.g., "image/jpeg"
    private Date uploadedAt;      // Date uploaded
    private Long relatedEntityId; // ID of the related entity, like Product ID
}

