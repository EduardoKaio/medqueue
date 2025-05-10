package com.medqueue.medqueue.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "fila_paciente")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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
    private Boolean notificado = false;

    @Builder.Default
    @Column(name = "check_in", nullable = false)
    private Boolean checkIn = false;

    private LocalDateTime createdAt;

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
