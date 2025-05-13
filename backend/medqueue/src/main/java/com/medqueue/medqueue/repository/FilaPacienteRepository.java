package com.medqueue.medqueue.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medqueue.medqueue.models.FilaPaciente;

public interface FilaPacienteRepository extends JpaRepository<FilaPaciente, Long> {

    List<FilaPaciente> findByFilaIdAndAtendidoFalseOrderByPosicao(Long filaId);

    FilaPaciente findFirstByFilaIdAndAtendidoFalseOrderByPosicao(Long filaId);

    Optional<FilaPaciente> findByPacienteIdAndFilaIdAndAtendidoFalse(Long pacienteId, Long filaId);

    Optional<FilaPaciente> findFirstByPacienteIdAndAtendidoFalseAndFilaAtivoTrue(Long pacienteId);

    List<FilaPaciente> findByFilaIdAndAtendidoFalseAndCheckInFalseOrderByPosicao(Long filaId);

    List<FilaPaciente> findByFilaIdAndAtendidoFalseOrderByPrioridade(Long filaId);
}
