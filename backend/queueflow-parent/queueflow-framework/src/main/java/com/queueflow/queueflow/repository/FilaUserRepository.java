package com.queueflow.queueflow.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.queueflow.queueflow.models.FilaUser;

public interface FilaUserRepository extends JpaRepository<FilaUser, Long> {

    List<FilaUser> findByFilaIdAndStatusOrderByPosicao(Long filaId, String status);

    FilaUser findFirstByFilaIdAndStatusOrderByPosicao(Long filaId, String status);

    Optional<FilaUser> findByUserIdAndFilaIdAndStatus(Long userId, Long filaId, String status);

    Optional<FilaUser> findFirstByUserIdAndStatusAndFilaAtivoTrue(Long userId, String status);

    List<FilaUser> findByFilaIdAndStatusAndCheckInFalseOrderByPosicao(Long filaId, String status);

    List<FilaUser> findByFilaId(Long filaId);

    List<FilaUser> findByFilaIdOrderByPosicao(Long filaId);

    List<FilaUser> findByFilaIdAndStatusOrderByPrioridade(Long filaId, String status);

    List<FilaUser> findAllByUserId(Long userId);

    Optional<FilaUser> findByUserIdAndFilaIdAndStatusIn(Long userId, Long filaId, List<String> statusList);

    List<FilaUser> findByUserIdAndFilaId(Long userId, Long filaId);
}
