package com.medqueue.medqueue.controller.admin;

import com.medqueue.medqueue.models.FilaPaciente;
import com.medqueue.medqueue.models.Fila;
import com.medqueue.medqueue.dto.FilaPacienteDTO;
import com.medqueue.medqueue.dto.HistoricoFilaDTO;
import com.medqueue.medqueue.dto.HistoricoPacienteAdminDTO;
import com.medqueue.medqueue.service.admin.FilaPacienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/admin/fila-paciente")
@RequiredArgsConstructor
@Tag(name = "Admin - Fila Paciente", description = "Gerenciamento de pacientes nas filas")
public class FilaPacienteController {

    private final FilaPacienteService filaPacienteService;


    @Operation(summary = "Listar pacientes na fila")
    @GetMapping("/list")
    public ResponseEntity<List<FilaPaciente>> listarPacientes(@RequestParam Long filaId) {
        List<FilaPaciente> pacientes = filaPacienteService.listarPacientes(filaId);
        return ResponseEntity.ok(pacientes);
    }

    @Operation(summary = "Listar fila ordenada", description = "Retorna a lista de pacientes em uma fila específica, ordenada pela posição.")
    @GetMapping("/ordered-list")
    public ResponseEntity<List<FilaPacienteDTO>> listarFilaOrdenada(@RequestParam Long filaId) {
        try {
            List<FilaPacienteDTO> filaOrdenada = filaPacienteService.listarFilaOrdenada(filaId);
            return ResponseEntity.ok(filaOrdenada);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @Operation(summary = "Listar filas ativas", description = "Retorna todas as filas que estão ativas.")
    @GetMapping("/active")
    public ResponseEntity<List<Fila>> listarFilasAtivas() {
        List<Fila> filasAtivas = filaPacienteService.listarFilasAtivas();
        return ResponseEntity.ok(filasAtivas);
    }

    @PutMapping("/{filaId}/paciente/{pacienteId}/check-in")
    @Operation(summary = "Realizar check-in do paciente na fila")
    public ResponseEntity<?> realizarCheckIn(
            @PathVariable Long filaId,
            @PathVariable Long pacienteId) {
        try {
            FilaPacienteDTO pacienteAtualizado = filaPacienteService.realizarCheckIn(filaId, pacienteId);
            return ResponseEntity.ok(pacienteAtualizado);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao realizar check-in: " + e.getMessage());
        }
    }

    @PutMapping("/{filaId}/paciente/{pacienteId}/status")
    @Operation(summary = "Atualiza o status de um paciente na fila")
    public ResponseEntity<?> atualizarStatusPaciente(
            @PathVariable Long filaId,
            @PathVariable Long pacienteId,
            @RequestBody Map<String, String> statusRequest) {
        
        String status = statusRequest.get("status");
        if (status == null || status.isEmpty()) {
            return ResponseEntity.badRequest().body("Status não pode ser vazio");
        }
        
        FilaPacienteDTO paciente = filaPacienteService.atualizarStatusPaciente(filaId, pacienteId, status);
        return ResponseEntity.ok(paciente);
    }

    @GetMapping("/historico/{pacienteId}")
    public ResponseEntity<?> getHistoricoDoPaciente(@PathVariable Long pacienteId) {
        try {
            HistoricoPacienteAdminDTO historico = filaPacienteService.historicoFilaPacienteId(pacienteId);
            return ResponseEntity.ok(historico);
        } catch (ResponseStatusException e) {
            // Captura erros com status customizados do service
            return ResponseEntity.status(e.getStatusCode())
                .body(Map.of("mensagem", e.getReason()));
        } catch (RuntimeException e) {
            // Erros genéricos, como paciente sem histórico
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("mensagem", e.getMessage()));
        }
    }
    

}
