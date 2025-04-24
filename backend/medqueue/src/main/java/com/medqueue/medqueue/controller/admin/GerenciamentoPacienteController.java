package com.medqueue.medqueue.controller.admin;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.medqueue.medqueue.dto.PacienteDTO;
import com.medqueue.medqueue.service.admin.PacienteService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/paciente")
@RequiredArgsConstructor
@Tag(name = "Admin - Pacientes", description = "Gerenciamento de pacientes (CRUD)")
public class GerenciamentoPacienteController {

    private final PacienteService pacienteService;

    @GetMapping
    @Operation(summary = "Listar pacientes ativos")
    public ResponseEntity<List<PacienteDTO>> listarAtivos() {
        List<PacienteDTO> pacientes = pacienteService.listarAtivos();
        return ResponseEntity.ok(pacientes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            PacienteDTO paciente = pacienteService.buscarPorId(id);
            return ResponseEntity.ok(paciente);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("erro", e.getMessage()));
        }
    }


    @PostMapping
    @Operation(summary = "Cadastrar novo paciente")
    public ResponseEntity<?> criar(@RequestBody PacienteDTO pacienteDTO) {
        try {
            PacienteDTO novoPaciente = pacienteService.criar(pacienteDTO);
            return ResponseEntity.ok(novoPaciente);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar paciente por ID")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody PacienteDTO pacienteDTO) {
        try {
            PacienteDTO atualizado = pacienteService.atualizar(id, pacienteDTO);
            return ResponseEntity.ok(atualizado);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("erro", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
    

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir paciente por ID")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            pacienteService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("erro", e.getMessage()));
        }

    }

    @GetMapping("/count")
    @Operation(summary = "Obter contagem total de pacientes")
    public ResponseEntity<Map<String, Long>> contar() {
        long count = pacienteService.getContagem();
        return ResponseEntity.ok(Map.of("count", count));
    }
}

