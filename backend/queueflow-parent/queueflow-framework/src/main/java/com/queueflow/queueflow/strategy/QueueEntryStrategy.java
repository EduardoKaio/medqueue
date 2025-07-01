package com.queueflow.queueflow.strategy;

import com.queueflow.queueflow.models.Fila;
import com.queueflow.queueflow.models.FilaUser;
import com.queueflow.queueflow.models.User;

public interface QueueEntryStrategy {
    FilaUser queueEntry(Fila fila, User user, Integer prioridade, int posicao);
}
