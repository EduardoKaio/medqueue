package com.medqueue.medqueue.controller.paciente;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medqueue.medqueue.dto.HistoricoFilaDTO;
import com.medqueue.medqueue.dto.InfoFilaParaPacienteDTO;
import com.medqueue.medqueue.service.paciente.InfoFilaPacienteService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/paciente/fila")
@RequiredArgsConstructor
public class InfoFilaPacienteController {

    private final InfoFilaPacienteService infoFilaPacienteService;

    @GetMapping("/info")
    @Operation(summary = "Ver informações da fila do paciente")
    public ResponseEntity<?> infoFilaPaciente() {
        try {
            InfoFilaParaPacienteDTO dto = infoFilaPacienteService.infoFilaPaciente();
            if (dto == null) {
                return ResponseEntity.ok().body(
                    Map.of("mensagem", "Paciente não está em nenhuma fila no momento.")
                );
            }
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(
                Map.of("erro", "Erro ao buscar informações da fila.")
            );
        }
    }
    @GetMapping("/historico")
    public ResponseEntity<?> historicoFilasPaciente() {
        try {
            List<HistoricoFilaDTO> historico = infoFilaPacienteService.historicoFilasPaciente();
            return ResponseEntity.ok(historico);
        } catch (RuntimeException e) {
            Map<String, String> response = Map.of("mensagem", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> response = Map.of("mensagem", "Erro ao buscar histórico de filas.");
            return ResponseEntity.status(500).body(response);
        }
    }
}
