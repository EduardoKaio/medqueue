package com.queueflow.queueflow.controller.user;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.queueflow.queueflow.dto.UserDTO;
import com.queueflow.queueflow.service.admin.FilaUserService;
import com.queueflow.queueflow.service.admin.FilaService;
import com.queueflow.queueflow.service.admin.UserService;
import com.queueflow.queueflow.service.auth.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@Tag(name = "Users", description = "Gerenciamento do próprio user")
public class UserController {

    private final UserService userService;

    private final FilaUserService filaUserService;

    private final AuthService authService;

    private final FilaService filaService;

    @GetMapping("/getProfile")
    public ResponseEntity<?> getCurrentUser() {
        try {
            Long id = authService.getIdDoUsuario();

            UserDTO user = userService.buscarPorId(id);
            return ResponseEntity.ok(user);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("erro", e.getMessage()));
        }
    }

    @PutMapping("/update")
    @Operation(summary = "User atualiza seus dados")
    public ResponseEntity<?> updateUser(@RequestBody UserDTO userDTO) {
        try {
            Long id = authService.getIdDoUsuario();

            UserDTO atualizado = userService.atualizar(id, userDTO);
            return ResponseEntity.ok(atualizado);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("erro", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @PostMapping("/enterQueue")
    @Operation(summary = "User entra na fila")
    public ResponseEntity<?> enterQueue(@RequestParam String extraInfo, @RequestParam Integer prioridade) {
        try {
            Long userId = authService.getIdDoUsuario();

            filaUserService.addUser(userId, extraInfo, prioridade);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User adicionado à fila com sucesso",
                "filaId", extraInfo
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
            } else if (message.contains("user só pode")) {
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
