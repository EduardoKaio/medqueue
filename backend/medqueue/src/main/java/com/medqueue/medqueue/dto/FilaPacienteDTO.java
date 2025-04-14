package com.medqueue.medqueue.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FilaPacienteDTO {
    private Long pacienteId;
    private String nomePaciente;
    private Integer posicao;
    private Boolean atendido;
}
