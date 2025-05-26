package com.medqueue.medqueue.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistoricoPacienteAdminDTO {
    private String nomePaciente;
    private List<HistoricoFilaDTO> historicoFilas;
}
