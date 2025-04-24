package com.medqueue.medqueue.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PrioridadeResponseDTO {
    private String prompt;
    private String resposta;
    private int prioridade;
}
