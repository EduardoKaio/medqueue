package com.queueflow.queueflow.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.queueflow.queueflow.models.FilaUser;

public interface FilaUserRepository<F extends FilaUser> extends JpaRepository<F, Long> {

    List<F> findByFilaIdAndStatusOrderByPosicao(Long filaId, String status);

    F findFirstByFilaIdAndStatusOrderByPosicao(Long filaId, String status);

    Optional<F> findByUserIdAndFilaIdAndStatus(Long userId, Long filaId, String status);

    Optional<F> findFirstByUserIdAndStatusAndFilaAtivoTrue(Long userId, String status);

    List<F> findByFilaIdAndStatusAndCheckInFalseOrderByPosicao(Long filaId, String status);

    List<F> findByFilaId(Long filaId);

    List<F> findByFilaIdOrderByPosicao(Long filaId);

    List<F> findByFilaIdAndStatusOrderByPrioridade(Long filaId, String status);

    List<F> findAllByUserId(Long userId);

    Optional<F> findByUserIdAndFilaIdAndStatusIn(Long userId, Long filaId, List<String> statusList);

    List<F> findByUserIdAndFilaId(Long userId, Long filaId);
}
