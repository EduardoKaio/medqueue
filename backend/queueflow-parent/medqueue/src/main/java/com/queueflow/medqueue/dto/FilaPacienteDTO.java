package com.queueflow.medqueue.dto;

import java.time.LocalDateTime;

import com.queueflow.queueflow.dto.FilaUserDTO;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class FilaPacienteDTO extends FilaUserDTO {

    public FilaPacienteDTO(Long userId, String nomeUser, Integer posicao, String status,
            LocalDateTime dataEntrada, Boolean checkIn, Integer prioridade) {
        super(userId, nomeUser, posicao, status, dataEntrada, checkIn, prioridade);
    }
}
