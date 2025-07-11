package com.queueflow.vetqueue.factory;

import com.queueflow.vetqueue.dto.AnimalDTO;
import com.queueflow.vetqueue.models.Animal;
import com.queueflow.vetqueue.models.Dono;
import org.springframework.stereotype.Component;

@Component
public class AnimalFactory {

    public AnimalDTO toDTO(Animal animal) {
        AnimalDTO dto = new AnimalDTO();
        dto.setId(animal.getId());
        dto.setNome(animal.getNome());
        dto.setEspecie(animal.getEspecie());
        dto.setRaca(animal.getRaca());
        dto.setIdade(animal.getIdade());
        dto.setDonoId(animal.getDono() != null ? animal.getDono().getId() : null);
        return dto;
    }

    public Animal fromDTO(AnimalDTO dto, Dono dono) {
        Animal animal = new Animal();
        animal.setNome(dto.getNome());
        animal.setEspecie(dto.getEspecie());
        animal.setRaca(dto.getRaca());
        animal.setIdade(dto.getIdade());
        animal.setDono(dono);
        return animal;
    }

    public void updateFromDTO(AnimalDTO dto, Animal animal) {
        animal.setNome(dto.getNome());
        animal.setEspecie(dto.getEspecie());
        animal.setRaca(dto.getRaca());
        animal.setIdade(dto.getIdade());
        // Dono normalmente não se troca aqui, pois é relacionamento fixo.
    }
}
