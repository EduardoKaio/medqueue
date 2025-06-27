package com.queueflow.queueflow.models;

import java.time.LocalDate;

import org.hibernate.annotations.SQLDelete;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "fila")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE fila SET ativo = false WHERE id = ?")
public class Fila {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(length = 255)
    private String descricao;

    @Builder.Default
    @Column(nullable = false)
    private Boolean ativo = true;

    @Builder.Default
    @Column(name = "tempo_medio", nullable = false)
    private Double tempoMedio = 0.0;

    @Builder.Default
    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDate dataCriacao = LocalDate.now();

    @Builder.Default
    @Column(name = "especialidade", nullable = false)
    private String especialidade = "geral";
}
