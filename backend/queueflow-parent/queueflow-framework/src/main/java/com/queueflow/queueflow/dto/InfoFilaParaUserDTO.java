package com.queueflow.queueflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InfoFilaParaUserDTO {
    private Long filaId;
    private Long userId;
    private Integer posicao;
    private Double tempoEstimado;
}
