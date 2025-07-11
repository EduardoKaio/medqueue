package com.queueflow.bankqueue.strategy;

import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

import com.queueflow.queueflow.models.Fila;
import com.queueflow.queueflow.models.FilaUser;
import com.queueflow.queueflow.models.User;
import com.queueflow.queueflow.strategy.QueueEntryStrategy;

@Component
public class ClienteEntryQueueStrategy implements QueueEntryStrategy {

   @Override
    public FilaUser queueEntry(Fila fila, User user, Integer prioridade, int posicao) {
        FilaUser filaUser = new FilaUser();
        filaUser.setFila(fila);
        filaUser.setUser(user);
        filaUser.setPrioridade(prioridade);
        filaUser.setPosicao(posicao);
        filaUser.setDataEntrada(LocalDateTime.now());
        return filaUser;
    }
    
}
