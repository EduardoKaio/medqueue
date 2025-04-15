package com.medqueue.medqueue.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "paciente")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE paciente SET ativo = false WHERE id = ?")
@SQLRestriction("ativo = true")
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(unique = true, nullable = false)
    private String cpf;

    @Column(name = "data_nascimento", nullable = false)
    private LocalDate dataNascimento;

    @Enumerated(EnumType.STRING)
    private Sexo sexo;

    private String email;

    private String telefone;

    private String endereco;

    @Builder.Default
    @Column(nullable = false)
    private Boolean ativo = true;

    public enum Sexo {
        M, F, Outro
    }
}

