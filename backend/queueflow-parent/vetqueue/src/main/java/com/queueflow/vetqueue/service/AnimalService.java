package com.queueflow.vetqueue.service;

import com.queueflow.vetqueue.dto.AnimalDTO;
import com.queueflow.vetqueue.factory.AnimalFactory;
import com.queueflow.vetqueue.models.Animal;
import com.queueflow.vetqueue.models.Dono;
import com.queueflow.vetqueue.repository.AnimalRepository;
import com.queueflow.vetqueue.repository.DonoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnimalService {

    private final AnimalRepository animalRepository;
    private final DonoRepository donoRepository;
    private final AnimalFactory animalFactory;

    public AnimalDTO createAnimal(AnimalDTO dto) {
        Dono dono = donoRepository.findById(dto.getDonoId())
                .orElseThrow(() -> new RuntimeException("Dono não encontrado"));

        Animal animal = animalFactory.fromDTO(dto, dono);
        Animal saved = animalRepository.save(animal);

        return animalFactory.toDTO(saved);
    }

    public AnimalDTO updateAnimal(Long id, AnimalDTO dto) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Animal não encontrado"));

        animalFactory.updateFromDTO(dto, animal);

        Animal updated = animalRepository.save(animal);

        return animalFactory.toDTO(updated);
    }

    public void deleteAnimal(Long id) {
        animalRepository.deleteById(id);
    }

    public AnimalDTO getAnimalById(Long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Animal não encontrado"));
        return animalFactory.toDTO(animal);
    }

    public List<AnimalDTO> getAnimalsByDono(Long donoId) {
        List<Animal> animais = animalRepository.findByDonoId(donoId);
        return animais.stream()
                .map(animalFactory::toDTO)
                .collect(Collectors.toList());
    }
    public Long getDonoIdByCpf(String cpf) {
        Dono dono = donoRepository.findByCpf(cpf)
                .orElseThrow(() -> new RuntimeException("Dono não encontrado para CPF: " + cpf));
        return dono.getId();
    }
}
