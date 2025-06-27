package com.queueflow.queueflow.repository;

import java.util.List;
import java.util.Optional;

import com.queueflow.queueflow.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByCpf(String cpf);

    List<User> findByAtivoTrue();

    Optional<User> findByCpf(String cpf);
}
