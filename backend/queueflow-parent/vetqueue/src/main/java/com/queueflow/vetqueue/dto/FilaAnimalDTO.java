package com.queueflow.vetqueue.dto;

import java.time.LocalDateTime;
import lombok.Data;
import lombok.EqualsAndHashCode;
import com.queueflow.vetqueue.models.Animal;
import com.queueflow.queueflow.dto.FilaUserDTO;

@Data
@EqualsAndHashCode(callSuper = true)
public class FilaAnimalDTO extends FilaUserDTO{
    
    private Animal animal;
    
    // Construtor para facilitar a criação do objeto
    public FilaAnimalDTO(Long userId, String nomeUser, Integer posicao, String status,
                           LocalDateTime dataEntrada, Boolean checkIn, Integer prioridade, Animal animal) {
        super(userId, nomeUser, posicao, status, dataEntrada, checkIn, prioridade);
        this.animal = animal;
    }
    
}
