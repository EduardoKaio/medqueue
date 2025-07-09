package com.queueflow.medqueue.repository;

import org.springframework.stereotype.Repository;

import com.queueflow.medqueue.models.FilaPaciente;
import com.queueflow.queueflow.repository.FilaUserRepository;

@Repository
public interface FilaPacienteRepository extends FilaUserRepository<FilaPaciente> {
    
}
