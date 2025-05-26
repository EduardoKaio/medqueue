package com.medqueue.medqueue.controller.paciente;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.medqueue.medqueue.dto.PacienteDTO;
import com.medqueue.medqueue.service.admin.FilaPacienteService;
import com.medqueue.medqueue.service.admin.FilaService;
import com.medqueue.medqueue.service.admin.PacienteService;
import com.medqueue.medqueue.service.auth.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/paciente")
@RequiredArgsConstructor
@Tag(name = "Pacientes", description = "Gerenciamento do próprio paciente")
public class PacienteController {

    private final PacienteService pacienteService;

    private final FilaPacienteService filaPacienteService;

    private final AuthService authService;

    private final FilaService filaService;

    @GetMapping("/getProfile")
    public ResponseEntity<?> getCurrentUser() {
        try {
            Long id = authService.getIdDoUsuario();

            PacienteDTO paciente = pacienteService.buscarPorId(id);
            return ResponseEntity.ok(paciente);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("erro", e.getMessage()));
        }
    }

    @PutMapping("/update")
    @Operation(summary = "Paciente atualiza seus dados")
    public ResponseEntity<?> updateUser(@RequestBody PacienteDTO pacienteDTO) {
        try {
            Long id = authService.getIdDoUsuario();

            PacienteDTO atualizado = pacienteService.atualizar(id, pacienteDTO);
            return ResponseEntity.ok(atualizado);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("erro", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @PostMapping("/enterQueue")
    @Operation(summary = "Paciente entra na fila")
    public ResponseEntity<?> enterQueue(@RequestParam String especialidade, @RequestParam Integer prioridade) {
        try {
            Long pacienteId = authService.getIdDoUsuario();
            Long filaId = filaService.getFilaComEspecialidade(especialidade);

            filaPacienteService.addPaciente(pacienteId, filaId, prioridade);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Paciente adicionado à fila com sucesso",
                "filaId", filaId
            ));

        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of(
                "success", false,
                "errorCode", "FILA_NAO_ENCONTRADA",
                "message", e.getMessage()
            ));
        } catch (IllegalStateException e) {
            // Verificar tipo específico de erro
            String message = e.getMessage();
            String errorCode = "ERRO_DESCONHECIDO";
            
            if (message.contains("já está na fila")) {
                errorCode = "PACIENTE_JA_NA_FILA";
            } else if (message.contains("paciente só pode")) {
                errorCode = "PACIENTE_EM_OUTRA_FILA";
            } else if (message.contains("está inativa")) {
                errorCode = "FILA_INATIVA";
            }
            
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "errorCode", errorCode,
                "message", message
            ));
        }
    }

}
