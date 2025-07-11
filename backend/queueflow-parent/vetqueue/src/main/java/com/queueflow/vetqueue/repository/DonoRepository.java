package com.queueflow.vetqueue.repository;

import com.queueflow.vetqueue.models.Dono;
import com.queueflow.queueflow.repository.UserRepository;

import java.util.Optional;

import org.springframework.stereotype.Repository;

@Repository
public interface DonoRepository extends UserRepository<Dono> {
    Optional<Dono> findByCpf(String cpf);
}
