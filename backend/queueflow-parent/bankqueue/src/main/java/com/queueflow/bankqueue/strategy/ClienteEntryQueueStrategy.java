package com.queueflow.bankqueue.strategy;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.queueflow.bankqueue.models.Cliente;
import com.queueflow.bankqueue.models.FilaCliente;
import com.queueflow.bankqueue.repository.FilaClienteRepository;
import com.queueflow.queueflow.models.Fila;
import com.queueflow.queueflow.strategy.QueueStrategy;

@Component
public class ClienteEntryQueueStrategy implements QueueStrategy<Cliente, FilaCliente> {

    private final FilaClienteRepository filaClienteRepository;

    public ClienteEntryQueueStrategy(FilaClienteRepository filaClienteRepository) {
        this.filaClienteRepository = filaClienteRepository;
    }

    @Override
    public FilaCliente queueEntry(Fila fila, Cliente user, Integer prioridade, int posicao) {
        FilaCliente filaCliente = new FilaCliente();
        filaCliente.setFila(fila);
        filaCliente.setUser(user);
        filaCliente.setPrioridade(prioridade);
        filaCliente.setPosicao(posicao);
        filaCliente.setDataEntrada(LocalDateTime.now());
        return filaCliente;
    }

    @Override
    public List<FilaCliente> findEntityByFilaIdAndEntityId(Long filaId, Long entityId) {
        return filaClienteRepository.findByUserIdAndFilaId(entityId, filaId);
    }

    @Override
    public Optional<FilaCliente> findEntityByFilaIdAndEntityIdAndStatus(Long filaId, Long entityId, String status) {
        return filaClienteRepository.findByUserIdAndFilaIdAndStatus(entityId, filaId, status);
    }
}
