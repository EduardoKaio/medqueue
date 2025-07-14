package com.queueflow.queueflow.strategy;

import com.queueflow.queueflow.models.Fila;
import com.queueflow.queueflow.models.FilaUser;

public interface QueueStrategy <T>{
    FilaUser queueEntry(Fila fila, T entity, Integer prioridade, int posicao);    
}
