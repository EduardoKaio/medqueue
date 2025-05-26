package com.medqueue.medqueue.controller.admin;

import com.medqueue.medqueue.models.Fila;
import com.medqueue.medqueue.dto.FilaDTO;
import com.medqueue.medqueue.service.admin.FilaService;
import com.medqueue.medqueue.dto.ErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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

    @GetMapping("/listAll")
    @Operation(summary = "Listar filas ativas")
    public ResponseEntity<List<Fila>> listarTodasFilas() {
        List<Fila> filas = filaService.listarTodas();
        return ResponseEntity.ok(filas);
    }


    @PostMapping
    @Operation(summary = "Criar uma nova fila")
    public ResponseEntity<?> criarFila(@RequestBody Fila novaFila) {
        try {
            Fila filaCriada = filaService.criarFila(novaFila);
            return ResponseEntity.ok(filaCriada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Erro interno ao processar a requisição."));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar uma fila")
    public ResponseEntity<String> deletarFila(@PathVariable Long id) {
        filaService.deletarFila(id);
        return ResponseEntity.ok("Fila com ID " + id + " foi deletada.");
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Atualizar parcialmente uma fila")
    public ResponseEntity<Fila> editarFila(
            @PathVariable Long id,
            @RequestBody FilaDTO dto) {
        Fila filaAtualizada = filaService.editarFila(id, dto);
        return ResponseEntity.ok(filaAtualizada);
    }

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

    @PostMapping("/filaDoDia")
    @Operation(summary = "Criar uma nova fila")
    public ResponseEntity<?> criarFilaGeralDoDia(@RequestBody Fila filaGeralDoDia) {
        try {
            Fila filaGeral = filaService.criarFilaGeralDoDia(filaGeralDoDia);
            return ResponseEntity.ok(filaGeral);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Erro interno ao processar a requisição."));
        }
    }
}
