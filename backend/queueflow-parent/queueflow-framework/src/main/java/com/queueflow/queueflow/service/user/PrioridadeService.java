package com.queueflow.queueflow.service.user;

import com.queueflow.queueflow.dto.PrioridadeRequestDTO;
import com.queueflow.queueflow.strategy.PrioridadeStrategy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PrioridadeService {

    private final PrioridadeStrategy prioridadeStrategy;

     public int avaliarPrioridade(PrioridadeRequestDTO request) {
        return prioridadeStrategy.calcularPrioridade(request);
    }
}
