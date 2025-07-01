package com.queueflow.medqueue.strategy;

import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

import com.queueflow.medqueue.models.FilaPaciente;
import com.queueflow.queueflow.models.Fila;
import com.queueflow.queueflow.models.FilaUser;
import com.queueflow.queueflow.models.User;
import com.queueflow.queueflow.strategy.QueueEntryStrategy;

@Component
public class PacienteEntryStrategy implements QueueEntryStrategy {

    @Override
    public FilaUser queueEntry(Fila fila, User user, Integer prioridade, int posicao) {
        
        FilaPaciente filaPaciente = new FilaPaciente();
        filaPaciente.setUser(user);
        filaPaciente.setFila(fila);
        filaPaciente.setPosicao(posicao);
        filaPaciente.setStatus("Na fila");
        filaPaciente.setDataEntrada(LocalDateTime.now());
        filaPaciente.setPrioridade(prioridade);

        return filaPaciente;
    }
    
}
