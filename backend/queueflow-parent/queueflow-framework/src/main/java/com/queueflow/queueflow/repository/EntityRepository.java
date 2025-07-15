package com.queueflow.queueflow.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface EntityRepository<E> extends JpaRepository<E, Long> {

    boolean existsByCpf(String cpf);

    List<E> findByAtivoTrue();

    Optional<E> findByCpf(String cpf);
}