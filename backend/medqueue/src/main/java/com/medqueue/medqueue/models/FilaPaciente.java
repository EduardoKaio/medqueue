package com.medqueue.medqueue.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Entity
@Table(name = "fila_paciente")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE fila_paciente SET ativo = false WHERE id = ?")
@SQLRestriction("ativo = true")
public class FilaPaciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "paciente_id", nullable = false)
    private Paciente paciente;

    @ManyToOne
    @JoinColumn(name = "fila_id", nullable = false)
    private Fila fila;

    @Column(nullable = false)
    private Integer posicao;

    @Builder.Default
    @Column(name = "data_entrada", nullable = false, updatable = false)
    private LocalDateTime dataEntrada = LocalDateTime.now();

    @Builder.Default
    @Column(nullable = false)
    private Boolean atendido = false;

    @Builder.Default
    @Column(nullable = false)
    private Boolean ativo = true;
}
