package com.queueflow.vetqueue.adapters;

import lombok.*;
import com.queueflow.queueflow.models.QueueSubject;
import com.queueflow.vetqueue.models.Animal; // Importe Animal

@RequiredArgsConstructor
public class AnimalAdapter implements QueueSubject {
    private final Animal animal;

    @Override
    public Long getId() {
        return animal.getId();
    }

    @Override
    public String getNome() {
        // Retorna o nome do animal
        return animal.getNome();
    }

    @Override
    public String getTelefone() {
        return animal.getDono().getTelefone();
    }

    public Animal getAnimal() { 
        return this.animal; 
    }
}