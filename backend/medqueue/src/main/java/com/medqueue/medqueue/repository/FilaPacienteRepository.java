package com.medqueue.medqueue.repository;

import com.medqueue.medqueue.models.FilaPaciente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FilaPacienteRepository extends JpaRepository<FilaPaciente, Long> {
    List<FilaPaciente> findByFilaIdAndStatusOrderByPosicao(Long filaId, String status);
    FilaPaciente findFirstByFilaIdAndStatusOrderByPosicao(Long filaId, String status);
    Optional<FilaPaciente> findByPacienteIdAndFilaIdAndStatus(Long pacienteId, Long filaId, String status);
    Optional<FilaPaciente> findFirstByPacienteIdAndStatusAndFilaAtivoTrue(Long pacienteId, String status);
    List<FilaPaciente> findByFilaIdAndStatusAndCheckInFalseOrderByPosicao(Long filaId, String status);
    Optional<FilaPaciente> findByPacienteIdAndFilaId(Long pacienteId, Long filaId);
    List<FilaPaciente> findByFilaId(Long filaId);
}
