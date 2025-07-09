package com.queueflow.medqueue.controller;

import com.queueflow.queueflow.dto.PrioridadeRequestDTO;
import com.queueflow.queueflow.strategy.PrioridadeStrategy;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user/triagem")
public class TriagemController {

    private final PrioridadeStrategy prioridadeStrategy;

    public TriagemController(PrioridadeStrategy prioridadeStrategy) {
        this.prioridadeStrategy = prioridadeStrategy;
    }

   @PostMapping("/avaliar-prioridade")
    public ResponseEntity<?> avaliarPrioridade(@RequestBody PrioridadeRequestDTO request) {
        try {
            int prioridade = prioridadeStrategy.calcularPrioridade(request);

            String especialista = "Não disponível";
            String justificativaPrioridade = "Não disponível";
            String justificativaEspecialista = "Não disponível";

            if (prioridadeStrategy instanceof com.queueflow.medqueue.strategy.LlmPrioridadeStrategy l) {
                especialista = l.getUltimoEspecialista();
                justificativaPrioridade = l.getJustificativaPrioridade();
                justificativaEspecialista = l.getJustificativaEspecialista();
            }

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

