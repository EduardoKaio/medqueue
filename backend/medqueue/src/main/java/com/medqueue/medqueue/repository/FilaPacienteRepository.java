package com.medqueue.medqueue.repository;

import com.medqueue.medqueue.models.FilaPaciente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FilaPacienteRepository extends JpaRepository<FilaPaciente, Long> {
    List<FilaPaciente> findByFilaIdAndAtendidoFalseOrderByPosicao(Long filaId);
    FilaPaciente findFirstByFilaIdAndAtendidoFalseOrderByPosicao(Long filaId);
    Optional<FilaPaciente> findByPacienteIdAndFilaIdAndAtendidoFalse(Long pacienteId, Long filaId);
    List<FilaPaciente> findByAtivoTrue();
}
