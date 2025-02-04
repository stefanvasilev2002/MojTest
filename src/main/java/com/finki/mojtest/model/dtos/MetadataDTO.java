package com.finki.mojtest.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MetadataDTO {
    private Long id;
    private String key;
    private String value;

    private List<Long> questionIds;
    private List<Long> testIds;
}


