package com.medqueue.medqueue.controller.admin;

import com.medqueue.medqueue.dto.FilaPacienteDTO;
import com.medqueue.medqueue.dto.FilaPrioridadeDTO;
import com.medqueue.medqueue.service.admin.FilaPacienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/filas/prioridade")
@RequiredArgsConstructor
public class FilaPrioridadeController {

    private final FilaPacienteService filaPacienteService;

    @GetMapping("/proximo")
    public ResponseEntity<FilaPacienteDTO> buscarProximoPaciente() {
        FilaPacienteDTO proximoPaciente = filaPacienteService.buscarProximoPaciente();
        if (proximoPaciente == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(proximoPaciente);
    }

    @GetMapping("/todos")
    public ResponseEntity<List<FilaPrioridadeDTO>> listarPacientesComPrioridade() {
        List<FilaPrioridadeDTO> pacientes = filaPacienteService.listarTodosPacientesComPrioridade();
        if (pacientes.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(pacientes);
    }

    @PostMapping("/rebalancear")
    public ResponseEntity<Void> rebalancearPrioridades() {
        filaPacienteService.rebalancearPrioridades();
        return ResponseEntity.ok().build();
    }
}