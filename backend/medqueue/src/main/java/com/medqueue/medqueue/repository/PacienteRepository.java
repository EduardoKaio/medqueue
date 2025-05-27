package com.medqueue.medqueue.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medqueue.medqueue.models.Paciente;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    boolean existsByCpf(String cpf);

    List<Paciente> findByAtivoTrue();

    Optional<Paciente> findByCpf(String cpf);
}
