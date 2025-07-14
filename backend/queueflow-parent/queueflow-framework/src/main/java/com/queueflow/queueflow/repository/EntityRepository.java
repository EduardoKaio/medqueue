package com.queueflow.queueflow.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface EntityRepository<T> extends JpaRepository<T, Long> {

    boolean existsByCpf(String cpf);

    List<T> findByAtivoTrue();

    Optional<T> findByCpf(String cpf);
}