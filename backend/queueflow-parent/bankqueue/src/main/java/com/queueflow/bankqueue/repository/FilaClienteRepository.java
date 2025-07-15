package com.queueflow.bankqueue.repository;

import com.queueflow.queueflow.repository.FilaUserRepository;
import com.queueflow.bankqueue.models.FilaCliente;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FilaClienteRepository extends FilaUserRepository<FilaCliente> {
    // Usa userId em vez de clienteId porque FilaCliente herda a propriedade 'user' de FilaUser
    List<FilaCliente> findByUserIdAndFilaId(Long userId, Long filaId);

    Optional<FilaCliente> findByUserIdAndFilaIdAndStatus(Long userId, Long filaId, String status);
}
