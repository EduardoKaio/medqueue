// no pacote com.queueflow.vetqueue.repository
package com.queueflow.medqueue.repository;

import com.queueflow.queueflow.repository.FilaUserRepository;
import com.queueflow.medqueue.models.FilaPaciente;
import org.springframework.stereotype.Repository;

@Repository
public interface FilaPacienteRepository extends FilaUserRepository<FilaPaciente> {

}