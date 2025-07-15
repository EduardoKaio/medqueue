package com.queueflow.queueflow.controller.admin;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.queueflow.queueflow.dto.FilaUserDTO;
import com.queueflow.queueflow.dto.HistoricoUserAdminDTO;
import com.queueflow.queueflow.dto.QueueSubjectDTO;
import com.queueflow.queueflow.models.Fila;
import com.queueflow.queueflow.models.FilaUser;
import com.queueflow.queueflow.service.admin.AbstractFilaEntityService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/fila-user")
@RequiredArgsConstructor
@Tag(name = "Admin - Fila User", description = "Gerenciamento de users nas filas")
public class FilaUserController {

    private final AbstractFilaEntityService filaUserService;

    @Operation(summary = "Listar users na fila")
    @GetMapping("/list")
    public ResponseEntity<List<FilaUser>> listarUsers(@RequestParam Long filaId) {
        try {
            List<FilaUser> users = filaUserService.listarUsers(filaId);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @Operation(summary = "Listar fila ordenada", description = "Retorna a lista de users em uma fila específica, ordenada pela posição.")
    @GetMapping("/ordered-list")
    public ResponseEntity<List<FilaUserDTO>> listarFilaOrdenada(@RequestParam Long filaId) {
        try {
            System.out.println("Entrou no controller para listar a fila ordenada");
            List<FilaUserDTO> filaOrdenada = filaUserService.listarFilaOrdenada(filaId);
            return ResponseEntity.ok(filaOrdenada);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @Operation(summary = "Listar filas ativas", description = "Retorna todas as filas que estão ativas.")
    @GetMapping("/active")
    public ResponseEntity<List<Fila>> listarFilasAtivas() {
        List<Fila> filasAtivas = filaUserService.listarFilasAtivas();
        return ResponseEntity.ok(filasAtivas);
    }

    @PutMapping("/{filaId}/user/{entityId}/status")
    @Operation(summary = "Atualiza o status de um user na fila")
    public ResponseEntity<?> atualizarStatusUser(
            @PathVariable Long filaId,
            @PathVariable Long entityId,
            @RequestBody Map<String, String> statusRequest) {

        String status = statusRequest.get("status");
        if (status == null || status.isEmpty()) {
            return ResponseEntity.badRequest().body("Status não pode ser vazio");
        }

        try {
            FilaUserDTO user = filaUserService.atualizarStatusUser(filaId, entityId, status);
            return ResponseEntity.ok(user);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("erro", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("erro", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("erro", "Erro ao atualizar status: " + e.getMessage()));
        }
    }

    @GetMapping("/historico/{userId}")
    public ResponseEntity<?> getHistoricoDoUser(@PathVariable Long userId) {
        try {
            HistoricoUserAdminDTO historico = filaUserService.historicoFilaUserId(userId);
            return ResponseEntity.ok(historico);
        } catch (ResponseStatusException e) {
            // Captura erros com status customizados do service
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("mensagem", e.getReason()));
        } catch (RuntimeException e) {
            // Erros genéricos, como user sem histórico
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensagem", e.getMessage()));
        }
    }

}
