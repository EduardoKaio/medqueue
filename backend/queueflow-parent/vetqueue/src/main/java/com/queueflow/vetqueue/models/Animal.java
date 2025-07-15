package com.queueflow.vetqueue.models;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "animais")
public class Animal{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    private String especie;

    private String raca;

    private Integer idade;

    private Boolean ativo = true;

    private String cpf;

    @ManyToOne
    @JoinColumn(name = "dono_id")
    @JsonBackReference
    private Dono dono;

}
