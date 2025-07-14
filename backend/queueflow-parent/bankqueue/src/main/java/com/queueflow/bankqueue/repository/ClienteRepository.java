package com.queueflow.bankqueue.repository;

import com.queueflow.bankqueue.models.Cliente;
import com.queueflow.queueflow.repository.EntityRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends EntityRepository<Cliente> {
    
}
