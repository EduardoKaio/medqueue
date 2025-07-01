package com.queueflow.medqueue.models;

import com.queueflow.queueflow.models.FilaUser;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("FILA_PACIENTE")
public class FilaPaciente extends FilaUser{
    
}
