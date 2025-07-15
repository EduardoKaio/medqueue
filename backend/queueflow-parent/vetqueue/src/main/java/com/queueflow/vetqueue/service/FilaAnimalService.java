package com.queueflow.vetqueue.service;

import org.springframework.stereotype.Service;

import com.queueflow.vetqueue.adapters.AnimalAdapter; // Importe AnimalAdapter
import com.queueflow.vetqueue.dto.FilaAnimalDTO; // Importe FilaAnimalDTO
import com.queueflow.vetqueue.models.Animal; // Importe Animal (necessário para AnimalRepository)
import com.queueflow.vetqueue.models.FilaAnimal; // Importe Animal (necessário para AnimalRepository)
import com.queueflow.vetqueue.repository.AnimalRepository; // <-- IMPORTANTE: Seu repositório específico de Animal
import com.queueflow.vetqueue.repository.FilaAnimalRepository;

import com.queueflow.queueflow.dto.FilaUserDTO;
import com.queueflow.queueflow.dto.HistoricoFilaDTO; // Para historicoFilaUserId
import com.queueflow.queueflow.dto.HistoricoUserAdminDTO; // Para historicoFilaUserId
import com.queueflow.queueflow.dto.QueueSubjectDTO; // Para o addUser
import com.queueflow.queueflow.models.Fila;
import com.queueflow.queueflow.models.FilaUser;
import com.queueflow.queueflow.models.QueueSubject; // Importe QueueSubject
import com.queueflow.queueflow.repository.FilaRepository;
import com.queueflow.queueflow.repository.EntityRepository;
import com.queueflow.queueflow.repository.FilaUserRepository;
import com.queueflow.queueflow.service.admin.AbstractFilaEntityService;
import com.queueflow.queueflow.service.user.WhatsAppService;
import com.queueflow.queueflow.strategy.QueueStrategy;
import com.queueflow.queueflow.util.FilaUserValidator;

import java.util.List; // Importar List
import java.util.Optional; // Importar Optional
import java.util.stream.Collectors;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor; // Para construtor gerado

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