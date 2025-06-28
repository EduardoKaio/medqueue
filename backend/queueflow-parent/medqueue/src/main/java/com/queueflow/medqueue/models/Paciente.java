package com.queueflow.medqueue.models;

import com.queueflow.queueflow.models.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "paciente")
@Data
@EqualsAndHashCode(callSuper = true)
public class Paciente extends User {
    
}