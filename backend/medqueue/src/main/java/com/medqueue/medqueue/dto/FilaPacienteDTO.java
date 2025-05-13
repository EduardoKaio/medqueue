package com.medqueue.medqueue.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FilaPacienteDTO {
    private Long pacienteId;
    private String nomePaciente;
    private Integer posicao;
    private String status;
    private LocalDateTime dataEntrada;
    private Boolean checkIn;
    private Integer prioridade;
}
