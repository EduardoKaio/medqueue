package com.medqueue.medqueue.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medqueue.medqueue.models.Paciente;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    boolean existsByCpf(String cpf);
}
