package com.queueflow.queueflow.strategy;

import java.util.List;
import java.util.Optional;

import com.queueflow.queueflow.models.Fila;
import com.queueflow.queueflow.models.FilaUser;

public interface QueueStrategy<T, F extends FilaUser> {
    F queueEntry(Fila fila, T entity, Integer prioridade, int posicao);
    
    List<F> findEntityByFilaIdAndEntityId(Long filaId, Long entityId);

    Optional<F> findEntityByFilaIdAndEntityIdAndStatus(Long filaId, Long entityId, String status);
}
