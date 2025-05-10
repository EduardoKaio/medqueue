package com.medqueue.medqueue.controller.admin;

import com.medqueue.medqueue.models.Fila;
import com.medqueue.medqueue.service.admin.FilaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/fila")
@RequiredArgsConstructor
@Tag(name = "Admin - Filas", description = "Gerenciamento de filas")
public class FilaController {

    private final FilaService filaService;

    @GetMapping
    @Operation(summary = "Listar filas ativas")
    public ResponseEntity<List<Fila>> listarAtivas() {
        List<Fila> filasAtivas = filaService.listarAtivas();
        return ResponseEntity.ok(filasAtivas);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar uma fila")
    public ResponseEntity<String> deletarFila(@PathVariable Long id) {
        filaService.deletarFila(id);
        return ResponseEntity.ok("Fila com ID " + id + " foi desativada.");
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Atualizar um campo específico da fila")
    public ResponseEntity<Fila> atualizarCampo(
            @PathVariable Long id,
            @RequestParam String campo,
            @RequestParam Object valor) {
        Fila filaAtualizada = filaService.atualizarCampo(id, campo, valor);
        return ResponseEntity.ok(filaAtualizada);
    }
<<<<<<< Updated upstream
=======

    @GetMapping("/{id}")
    @Operation(summary = "Buscar fila por ID")
    public ResponseEntity<Fila> buscarPorId(@PathVariable Long id) {
        try {
            Fila fila = filaService.buscarPorId(id);
            return ResponseEntity.ok(fila);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/count")
    @Operation(summary = "Obter contagem total de filas ativas")
    public ResponseEntity<Map<String, Long>> contarFilasAtivas() {
        long count = filaService.getContagem();
        return ResponseEntity.ok(Map.of("count", count));
    }
>>>>>>> Stashed changes
}
