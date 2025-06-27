package com.queueflow.queueflow.controller.user;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.queueflow.queueflow.dto.HistoricoFilaDTO;
import com.queueflow.queueflow.dto.InfoFilaParaUserDTO;
import com.queueflow.queueflow.service.user.InfoFilaUserService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user/fila")
@RequiredArgsConstructor
public class InfoFilaUserController {

    private final InfoFilaUserService infoFilaUserService;

    @GetMapping("/info")
    @Operation(summary = "Ver informações da fila do user")
    public ResponseEntity<?> infoFilaUser() {
        try {
            InfoFilaParaUserDTO dto = infoFilaUserService.infoFilaUser();
            if (dto == null) {
                return ResponseEntity.ok().body(
                    Map.of("mensagem", "User não está em nenhuma fila no momento.")
                );
            }
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                Map.of("erro", "Erro ao buscar informações da fila.")
            );
        }
    }
    @GetMapping("/historico")
    public ResponseEntity<?> historicoFilasUser() {
        try {
            List<HistoricoFilaDTO> historico = infoFilaUserService.historicoFilasUser();
            return ResponseEntity.ok(historico);
        } catch (RuntimeException e) {
            Map<String, String> response = Map.of("mensagem", e.getMessage());
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            Map<String, String> response = Map.of("mensagem", "Erro ao buscar histórico de filas.");
            return ResponseEntity.status(500).body(response);
        }
    }
}
