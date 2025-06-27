package com.queueflow.queueflow.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.queueflow.queueflow.models.Fila;

public interface FilaRepository extends JpaRepository<Fila, Long> {

    List<Fila> findByAtivoTrue();

    Optional<Fila> findByEspecialidadeAndAtivoTrue(String especialidade);

    Optional<Fila> findByDataCriacaoAndEspecialidade(LocalDate dataCriacao, String especialidade);

    long countByAtivoTrue();

    List<Fila> findAllByOrderByAtivoDescDataCriacaoDesc();
}
