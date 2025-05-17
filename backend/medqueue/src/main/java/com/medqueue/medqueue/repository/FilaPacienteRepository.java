package com.medqueue.medqueue.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medqueue.medqueue.models.FilaPaciente;

public interface FilaPacienteRepository extends JpaRepository<FilaPaciente, Long> {
  
    List<FilaPaciente> findByFilaIdAndStatusOrderByPosicao(Long filaId, String status);
    
    FilaPaciente findFirstByFilaIdAndStatusOrderByPosicao(Long filaId, String status);
     
    Optional<FilaPaciente> findByPacienteIdAndFilaIdAndStatus(Long pacienteId, Long filaId, String status);
    
    Optional<FilaPaciente> findFirstByPacienteIdAndStatusAndFilaAtivoTrue(Long pacienteId, String status);
    
    List<FilaPaciente> findByFilaIdAndStatusAndCheckInFalseOrderByPosicao(Long filaId, String status);
    
    Optional<FilaPaciente> findByPacienteIdAndFilaId(Long pacienteId, Long filaId);
    
    List<FilaPaciente> findByFilaId(Long filaId);

    List<FilaPaciente> findByFilaIdOrderByPosicao(Long filaId);
    
    List<FilaPaciente> findByFilaIdAndStatusOrderByPrioridade(Long filaId, String status);

    List<FilaPaciente> findAllByPacienteId(Long pacienteId);
    
}
