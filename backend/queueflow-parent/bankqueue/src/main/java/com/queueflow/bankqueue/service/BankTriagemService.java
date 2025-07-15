package com.queueflow.bankqueue.service;

import com.queueflow.queueflow.dto.PrioridadeRequestDTO;
import java.util.Map;
import com.queueflow.queueflow.strategy.PrioridadeStrategy;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class BankTriagemService {
    private final PrioridadeStrategy prioridadeStrategy;

    public BankTriagemService(@Qualifier("bankPrioridadeStrategy") PrioridadeStrategy prioridadeStrategy) {
        this.prioridadeStrategy = prioridadeStrategy;
    }

    public Map<String, Object> avaliarPrioridade(PrioridadeRequestDTO request) {
        int prioridade = prioridadeStrategy.calcularPrioridade(request);
        String especialista = "Não disponível";
        String justificativaPrioridade = "Não disponível";
        String justificativaEspecialista = "Não disponível";

        if (prioridadeStrategy instanceof com.queueflow.bankqueue.strategy.BankPrioridadeStrategy b) {
            especialista = b.getUltimoEspecialista();
            justificativaPrioridade = b.getJustificativaPrioridade();
            justificativaEspecialista = b.getJustificativaEspecialista();
        }

        return Map.of(
            "prioridade", prioridade,
            "especialista", especialista,
            "justificativaPrioridade", justificativaPrioridade,
            "justificativaEspecialista", justificativaEspecialista
        );
    }
}
