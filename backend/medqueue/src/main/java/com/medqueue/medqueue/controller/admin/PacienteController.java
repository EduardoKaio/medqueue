package com.medqueue.medqueue.controller.admin;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.medqueue.medqueue.dto.PacienteDTO;
import com.medqueue.medqueue.service.admin.PacienteService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/paciente")
@RequiredArgsConstructor
@Tag(name = "Admin - Pacientes", description = "Gerenciamento de pacientes (CRUD)")
public class PacienteController {

    private final PacienteService pacienteService;

    @GetMapping
    @Operation(summary = "Listar pacientes ativos")
    public ResponseEntity<List<PacienteDTO>> listarAtivos() {
        List<PacienteDTO> pacientes = pacienteService.listarAtivos();
        return ResponseEntity.ok(pacientes);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar paciente por ID")
    public ResponseEntity<PacienteDTO> buscarPorId(@PathVariable Long id) {
        PacienteDTO paciente = pacienteService.buscarPorId(id);
        return ResponseEntity.ok(paciente);
    }

    @PostMapping
    @Operation(summary = "Cadastrar novo paciente")
    public ResponseEntity<PacienteDTO> criar(@RequestBody PacienteDTO pacienteDTO) {
        PacienteDTO novoPaciente = pacienteService.criar(pacienteDTO);
        return ResponseEntity.ok(novoPaciente);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar paciente por ID")
    public ResponseEntity<PacienteDTO> atualizar(@PathVariable Long id, @RequestBody PacienteDTO pacienteDTO) {
        PacienteDTO atualizado = pacienteService.atualizar(id, pacienteDTO);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir paciente por ID")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        pacienteService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count")
    @Operation(summary = "Obter contagem total de pacientes")
    public ResponseEntity<Map<String, Long>> contar() {
        long count = pacienteService.getContagem();
        return ResponseEntity.ok(Map.of("count", count));
    }
}

