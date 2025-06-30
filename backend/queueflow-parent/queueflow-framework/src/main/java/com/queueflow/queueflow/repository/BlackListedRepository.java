package com.queueflow.queueflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.queueflow.queueflow.models.BlackListedToken;

@Repository
public interface BlackListedRepository extends JpaRepository<BlackListedToken, String> {

    boolean existsByToken(String token);

    void deleteByToken(String token);
}
