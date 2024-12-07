package com.finki.mojtest.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentDTO extends UserDTO {

    private String grade;
    private List<Long> takenTestsIds; // Instead of full StudentTest objects, just store the IDs
}
