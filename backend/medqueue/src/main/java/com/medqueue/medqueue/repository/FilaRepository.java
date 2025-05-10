package com.medqueue.medqueue.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medqueue.medqueue.models.Fila;


public interface FilaRepository extends JpaRepository<Fila, Long> {
    List<Fila> findByAtivoTrue();
    Optional<Fila> findByDataCriacao(LocalDate data_criacao);
    long countByAtivoTrue();
}
