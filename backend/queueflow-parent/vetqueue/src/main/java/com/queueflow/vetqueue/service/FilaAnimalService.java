package com.queueflow.vetqueue.service;

import org.springframework.stereotype.Service;

import com.queueflow.vetqueue.adapters.AnimalAdapter;
import com.queueflow.vetqueue.dto.FilaAnimalDTO;
import com.queueflow.vetqueue.models.Animal;
import com.queueflow.vetqueue.models.FilaAnimal;
import com.queueflow.vetqueue.repository.AnimalRepository;

import com.queueflow.queueflow.repository.FilaRepository;
import com.queueflow.queueflow.repository.FilaUserRepository;
import com.queueflow.queueflow.service.admin.AbstractFilaEntityService;
import com.queueflow.queueflow.service.user.WhatsAppService;
import com.queueflow.queueflow.strategy.QueueStrategy;

@Service
public class FilaAnimalService extends AbstractFilaEntityService<Animal, AnimalAdapter, FilaAnimalDTO, FilaAnimal> {

    public FilaAnimalService(
        QueueStrategy<AnimalAdapter, FilaAnimal> queueStrategy,
        FilaUserRepository<FilaAnimal> filaUserRepository,
        FilaRepository filaRepository,
        WhatsAppService whatsAppService,
        AnimalRepository animalRepository
    ) {
        super(queueStrategy, filaUserRepository, filaRepository, whatsAppService, animalRepository);
    }

    @Override
    protected FilaAnimalDTO mapToFilaUserDTO(FilaAnimal filaUser) {
        System.out.println("Entrou no mapAnimal para listar a fila ordenada");

        return new FilaAnimalDTO(
            filaUser.getUser().getId(),
            filaUser.getUser().getNome(),
            filaUser.getPosicao(),
            filaUser.getStatus(),
            filaUser.getDataEntrada(),
            filaUser.getCheckIn(),
            filaUser.getPrioridade(),
            filaUser.getAnimal()
        );
    }

    @Override
    protected String getSystemName() {
        return "VetQueue";
    }

    @Override
    protected AnimalAdapter createQueueSubject(Animal animal) {
        // A lógica para criar o Adapter a partir da Entidade
        return new AnimalAdapter(animal);
    }
}