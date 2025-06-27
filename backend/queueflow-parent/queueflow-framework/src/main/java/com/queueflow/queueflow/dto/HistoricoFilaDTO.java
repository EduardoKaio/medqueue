package com.queueflow.queueflow.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistoricoFilaDTO {
    private Long filaId;
    private String nomeFila;
    private String especialidade;
    private int prioridade;
    private String status;
    private LocalDateTime dataEntrada;
}
