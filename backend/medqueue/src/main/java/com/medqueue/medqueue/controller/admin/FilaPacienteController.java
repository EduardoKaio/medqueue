package com.medqueue.medqueue.controller.admin;

import com.medqueue.medqueue.models.FilaPaciente;
import com.medqueue.medqueue.models.Fila;
import com.medqueue.medqueue.dto.FilaPacienteDTO;
import com.medqueue.medqueue.service.admin.FilaPacienteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/admin/fila-paciente")
@RequiredArgsConstructor
@Tag(name = "Admin - Fila Paciente", description = "Gerenciamento de pacientes nas filas")
public class FilaPacienteController {

    private final FilaPacienteService filaPacienteService;

    @Operation(summary = "Adicionar paciente à fila")
    @PostMapping("/add")
    public ResponseEntity<String> addPaciente(@RequestParam Long pacienteId, @RequestParam Long filaId) {
        try {
            filaPacienteService.addPaciente(pacienteId, filaId);
            return ResponseEntity.ok("Paciente adicionado à fila com ID: " + filaId);
        } catch (EntityNotFoundException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Atender próximo paciente da fila", description = "Marca como atendido o próximo paciente da fila.")
    @DeleteMapping("/next")
    public ResponseEntity<String> atenderProximoPaciente(@RequestParam Long filaId) {
        try {
            FilaPaciente filaPaciente = filaPacienteService.atenderProximoPaciente(filaId);
            return ResponseEntity.ok("Paciente " + filaPaciente.getPaciente().getNome() + " atendido da fila com ID: " + filaId);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Listar pacientes na fila")
    @GetMapping("/list")
    public ResponseEntity<List<FilaPaciente>> listarPacientes(@RequestParam Long filaId) {
        List<FilaPaciente> pacientes = filaPacienteService.listarPacientes(filaId);
        return ResponseEntity.ok(pacientes);
    }

    @Operation(summary = "Verificar posição do paciente na fila", description = "Retorna a posição de um paciente em uma fila específica.")
    @GetMapping("/position")
    public ResponseEntity<String> verificarPosicaoPaciente(@RequestParam Long pacienteId, @RequestParam Long filaId) {
        try {
            FilaPaciente filaPaciente = filaPacienteService.buscarPacienteNaFila(pacienteId, filaId);
            return ResponseEntity.ok("O paciente com ID " + pacienteId + " está na posição: " + filaPaciente.getPosicao());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
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

    @Operation(summary = "Atualizar prioridade e tempo médio da fila", description = "Atualiza a prioridade e o tempo médio de uma fila específica.")
    @PutMapping("/update-priority-time")
    public ResponseEntity<?> atualizarPrioridadeETempoMedio(
            @RequestParam Long filaId,
            @RequestParam Integer prioridade,
            @RequestParam Double tempoMedio) {
        try {
            Fila filaAtualizada = filaPacienteService.atualizarPrioridadeETempoMedio(filaId, prioridade, tempoMedio);
            return ResponseEntity.ok(filaAtualizada);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Listar filas ativas", description = "Retorna todas as filas que estão ativas.")
    @GetMapping("/active")
    public ResponseEntity<List<Fila>> listarFilasAtivas() {
        List<Fila> filasAtivas = filaPacienteService.listarFilasAtivas();
        return ResponseEntity.ok(filasAtivas);
    }
}
