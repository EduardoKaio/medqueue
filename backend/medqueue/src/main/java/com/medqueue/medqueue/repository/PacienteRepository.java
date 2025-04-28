package com.medqueue.medqueue.repository;

import com.medqueue.medqueue.models.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    boolean existsByCpf(String cpf);
    List<Paciente> findByAtivoTrue();
    Optional<Paciente> findByCpf(String cpf);
}
