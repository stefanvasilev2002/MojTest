package com.finki.mojtest.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UploadFileResponse {
    private Long fileId;
    private String fileName;
    private String fileDownloadUri;
    private String fileType;
    private long size;
}
