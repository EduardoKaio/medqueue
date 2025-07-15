package com.queueflow.medqueue.strategy;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.queueflow.medqueue.adapters.PacienteAdapter;
import com.queueflow.medqueue.models.FilaPaciente;
import com.queueflow.queueflow.models.Fila;
import com.queueflow.queueflow.strategy.QueueStrategy;

import lombok.RequiredArgsConstructor;

import com.queueflow.medqueue.repository.FilaPacienteRepository;

@Component
@RequiredArgsConstructor
public class PacienteQueueStrategy implements QueueStrategy<PacienteAdapter, FilaPaciente> {

    private final FilaPacienteRepository filaPacienteRepository;

    @Override
    public FilaPaciente queueEntry(Fila fila, PacienteAdapter pacienteAdapter, Integer prioridade, int posicao) {
        
        FilaPaciente filaPaciente = new FilaPaciente();
        filaPaciente.setUser(pacienteAdapter.getPaciente());
        filaPaciente.setFila(fila);
        filaPaciente.setPosicao(posicao);
        filaPaciente.setStatus("Na fila");
        filaPaciente.setDataEntrada(LocalDateTime.now());
        filaPaciente.setPrioridade(prioridade);

        return filaPaciente;
    }
    
    @Override
    public List<FilaPaciente> findEntityByFilaIdAndEntityId(Long filaId, Long entityId) {
        List<FilaPaciente> entrada = filaPacienteRepository.findByUserIdAndFilaId(entityId, filaId);

        return entrada;
    }

    @Override
    public Optional<FilaPaciente> findEntityByFilaIdAndEntityIdAndStatus(Long filaId, Long entityId, String status) {
        Optional<FilaPaciente> entrada = filaPacienteRepository.findByUserIdAndFilaIdAndStatus(entityId, filaId, status);

        return entrada;
    }
}
