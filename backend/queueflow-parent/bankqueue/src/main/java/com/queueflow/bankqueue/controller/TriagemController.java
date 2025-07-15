package com.queueflow.bankqueue.controller;

import com.queueflow.queueflow.dto.PrioridadeRequestDTO;
import com.queueflow.bankqueue.strategy.BankPrioridadeStrategy;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/user/triagem")
public class TriagemController {
    private final BankPrioridadeStrategy prioridadeStrategy;

    public TriagemController(BankPrioridadeStrategy prioridadeStrategy) {
        this.prioridadeStrategy = prioridadeStrategy;
    }

    @PostMapping("/avaliar-prioridade")
    public ResponseEntity<?> avaliarPrioridade(@RequestBody PrioridadeRequestDTO request) {
        try {
            int prioridade = prioridadeStrategy.calcularPrioridade(request);
            String especialista = prioridadeStrategy.getUltimoEspecialista();
            String justificativaPrioridade = prioridadeStrategy.getJustificativaPrioridade();
            String justificativaEspecialista = prioridadeStrategy.getJustificativaEspecialista();
            Map<String, Object> resposta = Map.of(
                "prioridade", prioridade,
                "especialista", especialista,
                "justificativaPrioridade", justificativaPrioridade,
                "justificativaEspecialista", justificativaEspecialista
            );
            return ResponseEntity.ok(resposta);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("erro", "Erro ao avaliar prioridade: " + e.getMessage()));
        }
    }
}
