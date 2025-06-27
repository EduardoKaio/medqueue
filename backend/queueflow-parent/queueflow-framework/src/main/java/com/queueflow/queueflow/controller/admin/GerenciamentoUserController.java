package com.queueflow.queueflow.controller.admin;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.queueflow.queueflow.dto.UserDTO;
import com.queueflow.queueflow.service.admin.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/user")
@RequiredArgsConstructor
@Tag(name = "Admin - Users", description = "Gerenciamento de users (CRUD)")
public class GerenciamentoUserController {

    private final UserService userService;

    @GetMapping
    @Operation(summary = "Listar users ativos")
    public ResponseEntity<List<UserDTO>> listarAtivos() {
        List<UserDTO> users = userService.listarAtivos();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            UserDTO user = userService.buscarPorId(id);
            return ResponseEntity.ok(user);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("erro", e.getMessage()));
        }
    }

    @PostMapping
    @Operation(summary = "Cadastrar novo user")
    public ResponseEntity<?> criar(@RequestBody UserDTO userDTO) {
        try {
            UserDTO novoUser = userService.criar(userDTO);
            return ResponseEntity.ok(novoUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar user por ID")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        try {
            UserDTO atualizado = userService.atualizar(id, userDTO);
            return ResponseEntity.ok(atualizado);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("erro", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
    

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir user por ID")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            userService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(Map.of("erro", e.getMessage()));
        }

    }

    @GetMapping("/count")
    @Operation(summary = "Obter contagem total de users")
    public ResponseEntity<Map<String, Long>> contarUsers() {
        long count = userService.getContagem();
        return ResponseEntity.ok(Map.of("count", count));
    }
}

