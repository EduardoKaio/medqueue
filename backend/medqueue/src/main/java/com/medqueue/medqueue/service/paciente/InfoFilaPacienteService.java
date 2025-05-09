package com.medqueue.medqueue.service.paciente;

import com.medqueue.medqueue.dto.FilaPacienteDTO;
import com.medqueue.medqueue.dto.InfoFilaParaPacienteDTO;
import com.medqueue.medqueue.models.FilaPaciente;
import com.medqueue.medqueue.repository.FilaPacienteRepository;
import com.medqueue.medqueue.service.auth.AuthService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InfoFilaPacienteService {

    private final FilaPacienteRepository filaPacienteRepository;
    private final AuthService authService;

    public InfoFilaParaPacienteDTO infoFilaPaciente() {
        Long pacienteId = authService.getIdDoUsuario();
    
        FilaPaciente filaPaciente = filaPacienteRepository
                .findFirstByPacienteIdAndAtendidoFalseAndFilaAtivoTrue(pacienteId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Paciente com ID " + pacienteId + " não está em nenhuma fila ativa."));
    
        if (filaPaciente.getAtendido()) {
            throw new IllegalStateException("Paciente já foi atendido.");
        }

        if (filaPaciente.getCheckIn()) {
            throw new IllegalStateException("Paciente já realizou o check-in.");
        }
    
        int posicao = filaPaciente.getPosicao();
        double tempoMedio = filaPaciente.getFila().getTempoMedio();
        double tempoEstimado = tempoMedio * (posicao - 1);
    
        return new InfoFilaParaPacienteDTO(
                filaPaciente.getFila().getId(),
                pacienteId,
                posicao,
                tempoEstimado
        );
    }
    
}

