package com.medqueue.medqueue.controller.paciente;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.medqueue.medqueue.dto.PacienteDTO;
import com.medqueue.medqueue.service.admin.FilaPacienteService;
import com.medqueue.medqueue.service.admin.FilaService;
import com.medqueue.medqueue.service.admin.PacienteService;
import com.medqueue.medqueue.service.auth.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;

import java.util.Map;

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
    public ResponseEntity<String> enterQueue() {
        try {
            Long pacienteId = authService.getIdDoUsuario();
            Long filaId = filaService.getFilaDoDia();

            filaPacienteService.addPaciente(pacienteId, filaId);
            return ResponseEntity.ok("Paciente adicionado à fila com ID: " + filaId);
        } catch (EntityNotFoundException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}