package com.queueflow.queueflow.strategy;

import com.queueflow.queueflow.dto.PrioridadeRequestDTO;

public interface PrioridadeStrategy {
    int calcularPrioridade(PrioridadeRequestDTO dados);
}
