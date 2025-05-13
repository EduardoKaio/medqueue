package com.medqueue.medqueue.controller.paciente;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medqueue.medqueue.dto.InfoFilaParaPacienteDTO;
import com.medqueue.medqueue.service.paciente.InfoFilaPacienteService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/paciente/fila")
@RequiredArgsConstructor
public class InfoFilaPacienteController {

    private final InfoFilaPacienteService infoFilaPacienteService;

    @Operation(summary = "Ver informações da fila do paciente")
    @GetMapping("/info")
    public ResponseEntity<?> infoFilaPaciente() {
        try {
            InfoFilaParaPacienteDTO dto = infoFilaPacienteService.infoFilaPaciente();
            return ResponseEntity.ok(dto);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body("Paciente não está na fila ou fila inexistente.");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erro ao buscar informações da fila.");
        }
    }
    
}
