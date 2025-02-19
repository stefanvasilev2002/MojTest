package com.finki.mojtest.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TeacherDTO extends UserDTO {

    private List<Long> createdTestsIds;
    private List<Long> createdQuestionsIds;
}

