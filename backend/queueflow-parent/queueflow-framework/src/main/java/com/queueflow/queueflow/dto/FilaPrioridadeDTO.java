package com.queueflow.queueflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FilaPrioridadeDTO {
    private Long userId;
    private String userNome;
    private Long filaId;
    private String filaNome;
    private Integer prioridade;
    private Integer posicao;
    private Long tempoEsperaMinutos;
    private Double score;
}
