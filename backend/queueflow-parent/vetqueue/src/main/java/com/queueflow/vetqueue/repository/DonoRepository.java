package com.queueflow.vetqueue.repository;

import com.queueflow.vetqueue.models.Dono;
import com.queueflow.queueflow.repository.EntityRepository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

@Repository
public interface DonoRepository extends EntityRepository<Dono> {
    Optional<Dono> findByCpf(String cpf);
}
