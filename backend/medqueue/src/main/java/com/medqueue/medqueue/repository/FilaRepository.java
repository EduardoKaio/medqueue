package com.medqueue.medqueue.repository;

import com.medqueue.medqueue.models.Fila;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FilaRepository extends JpaRepository<Fila, Long> {
    List<Fila> findByAtivoTrue();
}
