package com.queueflow.queueflow.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FilaUserDTO {
    private Long userId;
    private String nomeUser;
    private Integer posicao;
    private String status;
    private LocalDateTime dataEntrada;
    private Boolean checkIn;
    private Integer prioridade;
}
