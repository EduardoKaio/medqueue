package com.medqueue.medqueue.service.paciente;

import com.medqueue.medqueue.dto.HistoricoFilaDTO;
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

        return filaPacienteRepository
                .findFirstByPacienteIdAndStatusAndFilaAtivoTrue(pacienteId, "Na fila")
                .filter(filaPaciente -> {
                    if ("Atendido".equals(filaPaciente.getStatus()) || Boolean.TRUE.equals(filaPaciente.getCheckIn())) {
                        return false;
                    }
                    return true;
                })
                .map(filaPaciente -> {
                    int posicao = filaPaciente.getPosicao();
                    double tempoMedio = filaPaciente.getFila().getTempoMedio();
                    double tempoEstimado = tempoMedio * (posicao - 1);

                    return new InfoFilaParaPacienteDTO(
                            filaPaciente.getFila().getId(),
                            pacienteId,
                            posicao,
                            tempoEstimado
                    );
                })
                .orElse(null); // retorna null se não estiver em nenhuma fila válida
    }


    public List<HistoricoFilaDTO> historicoFilasPaciente() {
        Long pacienteId = authService.getIdDoUsuario();

        List<FilaPaciente> filas = filaPacienteRepository.findAllByPacienteId(pacienteId);

        if (filas.isEmpty()) {
            throw new RuntimeException("O paciente ainda não possui histórico de filas.");
        }

        return filas.stream()
            .filter(filaPaciente -> filaPaciente.getFila() != null)
            .map(filaPaciente -> new HistoricoFilaDTO(
                filaPaciente.getFila().getId(),
                filaPaciente.getFila().getNome(),
                filaPaciente.getFila().getEspecialidade(),
                filaPaciente.getPrioridade(),
                filaPaciente.getStatus(),
                filaPaciente.getDataEntrada()
            ))
            .collect(Collectors.toList());
    }
    
}

