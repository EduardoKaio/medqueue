package com.queueflow.vetqueue.models;

import com.queueflow.queueflow.models.FilaUser;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("FILA_ANIMAL")
public class FilaAnimal extends FilaUser{
    @ManyToOne
    @JoinColumn(name = "animal_id")
    private Animal animal;
}
