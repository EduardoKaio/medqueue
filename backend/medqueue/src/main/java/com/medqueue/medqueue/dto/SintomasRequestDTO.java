package com.medqueue.medqueue.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SintomasRequestDTO {
    private String sintomas;
}
