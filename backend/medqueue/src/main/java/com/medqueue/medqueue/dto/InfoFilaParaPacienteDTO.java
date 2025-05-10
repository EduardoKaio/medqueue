package com.medqueue.medqueue.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InfoFilaParaPacienteDTO {
    private Long filaId;
    private Long pacienteId;
    private Integer posicao;
    private Double tempoEstimado;
}
