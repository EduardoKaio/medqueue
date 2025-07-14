package com.queueflow.bankqueue.strategy;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Component;

import com.queueflow.bankqueue.models.Cliente;
import com.queueflow.queueflow.models.Fila;
import com.queueflow.queueflow.models.FilaUser;
import com.queueflow.queueflow.strategy.QueueStrategy;

@Component
public class ClienteEntryQueueStrategy implements QueueStrategy<Cliente> {

    @Override
    public FilaUser queueEntry(Fila fila, Cliente user, Integer prioridade, int posicao) {
        FilaUser filaUser = new FilaUser();
        filaUser.setFila(fila);
        filaUser.setUser(user);
        filaUser.setPrioridade(prioridade);
        filaUser.setPosicao(posicao);
        filaUser.setDataEntrada(LocalDateTime.now());
        return filaUser;
    }
}
