package com.medqueue.medqueue.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medqueue.medqueue.models.BlackListedToken;

public interface BlackListedRepository extends JpaRepository<BlackListedToken, String> {
    boolean existsByToken(String token);
    void deleteByToken(String token);
}
