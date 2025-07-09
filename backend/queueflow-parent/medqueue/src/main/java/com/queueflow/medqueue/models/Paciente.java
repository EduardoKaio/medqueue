package com.queueflow.medqueue.models;

import com.queueflow.queueflow.models.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("PACIENTE")
public class Paciente extends User {
    
}