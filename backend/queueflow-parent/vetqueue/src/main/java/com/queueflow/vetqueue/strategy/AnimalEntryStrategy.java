package com.queueflow.vetqueue.strategy;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

import org.springframework.stereotype.Component;

import com.queueflow.queueflow.models.Fila;
import com.queueflow.queueflow.models.FilaUser;
import com.queueflow.queueflow.models.User;
import com.queueflow.queueflow.strategy.QueueStrategy;

import com.queueflow.vetqueue.adapters.AnimalAdapter;

import com.queueflow.vetqueue.models.Animal;
import com.queueflow.vetqueue.models.FilaAnimal;
import com.queueflow.vetqueue.repository.FilaAnimalRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AnimalEntryStrategy implements QueueStrategy<AnimalAdapter, FilaAnimal> {

    private final FilaAnimalRepository filaAnimalRepository;

    @Override
    public FilaAnimal queueEntry(Fila fila, AnimalAdapter animalAdapter, Integer prioridade, int posicao) {
        FilaAnimal filaAnimal = new FilaAnimal();
        filaAnimal.setFila(fila);
        filaAnimal.setUser(animalAdapter.getAnimal().getDono());
        filaAnimal.setAnimal(animalAdapter.getAnimal());
        filaAnimal.setPrioridade(prioridade);
        filaAnimal.setPosicao(posicao);
        filaAnimal.setDataEntrada(LocalDateTime.now());
        
        return filaAnimal;
    }
    
    @Override
    public List<FilaAnimal> findEntityByFilaIdAndEntityId(Long filaId, Long entityId) {
        List<FilaAnimal> entrada = filaAnimalRepository.findByAnimalIdAndFilaId(entityId, filaId);

        return entrada;
    }

    @Override
    public Optional<FilaAnimal> findEntityByFilaIdAndEntityIdAndStatus(Long filaId, Long entityId, String status) {
        Optional<FilaAnimal> entrada = filaAnimalRepository.findByAnimalIdAndFilaIdAndStatus(entityId, filaId, status);

        return entrada;
    }
}
