package com.finki.mojtest.model.dtos;

import com.finki.mojtest.model.Metadata;
import com.finki.mojtest.model.users.Teacher;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDTO {
    private Long id;
    private String description;
    private List<AnswerDTO> answers;
}

