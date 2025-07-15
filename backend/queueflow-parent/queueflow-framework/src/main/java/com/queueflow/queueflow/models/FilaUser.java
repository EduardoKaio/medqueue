package com.queueflow.queueflow.models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "fila_user")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FilaUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    protected User user;

    @ManyToOne
    @JoinColumn(name = "fila_id", nullable = false)
    protected Fila fila;

    @Column(nullable = false)
    protected Integer posicao;

    @Builder.Default
    @Column(name = "data_entrada", nullable = false, updatable = false)
    protected LocalDateTime dataEntrada = LocalDateTime.now();

    @Builder.Default
    @Column(nullable = false)
    protected String status = "Na fila";

    @Builder.Default
    @Column(nullable = false)
    protected Boolean notificado = false;

    @Builder.Default
    @Column(name = "check_in", nullable = false)
    protected Boolean checkIn = false;

    @Builder.Default
    @Column(name = "prioridade", nullable = false)
    protected Integer prioridade = 3;

    protected LocalDateTime createdAt;

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
