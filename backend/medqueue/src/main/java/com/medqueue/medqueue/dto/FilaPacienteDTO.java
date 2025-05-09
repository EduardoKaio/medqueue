package com.medqueue.medqueue.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class FilaPacienteDTO {
    private Long pacienteId;
    private String nomePaciente;
    private Integer posicao;
    private Boolean atendido;
    private LocalDateTime dataEntrada;
    private Boolean checkIn;
}
