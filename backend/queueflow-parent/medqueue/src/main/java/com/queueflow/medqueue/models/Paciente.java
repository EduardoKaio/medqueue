package com.queueflow.medqueue.models;

import com.queueflow.queueflow.models.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Table(name = "users")
@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Paciente extends User {
    
}