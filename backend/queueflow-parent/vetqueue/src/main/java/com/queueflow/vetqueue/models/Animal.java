package com.queueflow.vetqueue.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "animais")
public class Animal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private String especie;

    private String raca;

    private Integer idade;

    @ManyToOne
    @JoinColumn(name = "dono_id")
    private Dono dono;

}
