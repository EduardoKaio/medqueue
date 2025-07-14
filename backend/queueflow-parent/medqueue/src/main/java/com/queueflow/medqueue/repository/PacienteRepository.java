package com.queueflow.medqueue.repository;

import com.queueflow.medqueue.models.Paciente;
import com.queueflow.queueflow.repository.EntityRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PacienteRepository extends EntityRepository<Paciente> {
}
