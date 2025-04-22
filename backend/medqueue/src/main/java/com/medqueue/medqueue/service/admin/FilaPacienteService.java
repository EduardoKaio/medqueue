package com.medqueue.medqueue.service.admin;

import com.medqueue.medqueue.dto.FilaPacienteDTO;
import com.medqueue.medqueue.models.Fila;
import com.medqueue.medqueue.models.FilaPaciente;
import com.medqueue.medqueue.models.Paciente;
import com.medqueue.medqueue.repository.FilaPacienteRepository;
import com.medqueue.medqueue.repository.FilaRepository;
import com.medqueue.medqueue.repository.PacienteRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FilaPacienteService {

    private final FilaPacienteRepository filaPacienteRepository;
    private final FilaRepository filaRepository;
    private final PacienteRepository pacienteRepository;

    public void addPaciente(Long pacienteId, Long filaId) {
        Paciente paciente = pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new EntityNotFoundException("Paciente não encontrado com ID: " + pacienteId));

        Fila fila = filaRepository.findById(filaId)
                .orElseThrow(() -> new EntityNotFoundException("Fila não encontrada com ID: " + filaId));

        // Verifica se o paciente já está na fila
        Optional<FilaPaciente> existente = filaPacienteRepository
                .findByPacienteIdAndFilaIdAndAtendidoFalse(pacienteId, filaId);

        if (existente.isPresent()) {
            throw new IllegalStateException("Paciente já está na fila com ID: " + filaId);
        }

        int posicao = filaPacienteRepository.findByFilaIdAndAtendidoFalseOrderByPosicao(filaId).size() + 1;

        FilaPaciente filaPaciente = new FilaPaciente();
        filaPaciente.setPaciente(paciente);
        filaPaciente.setFila(fila);
        filaPaciente.setPosicao(posicao);
        filaPaciente.setAtendido(false);

        filaPacienteRepository.save(filaPaciente);
    }

    public FilaPaciente atenderProximoPaciente(Long filaId) {
        FilaPaciente filaPaciente = filaPacienteRepository.findFirstByFilaIdAndAtendidoFalseOrderByPosicao(filaId);
        if (filaPaciente == null) {
            throw new EntityNotFoundException("Nenhum paciente na fila com ID: " + filaId);
        }
        filaPaciente.setAtendido(true);
        // TODO: Reorganizar posições, se necessário
        return filaPacienteRepository.save(filaPaciente);
    }

    public List<FilaPaciente> listarPacientes(Long filaId) {
        return filaPacienteRepository.findByFilaIdAndAtendidoFalseOrderByPosicao(filaId);
    }

    public FilaPaciente buscarPacienteNaFila(Long pacienteId, Long filaId) {
        return filaPacienteRepository.findByPacienteIdAndFilaIdAndAtendidoFalse(pacienteId, filaId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Paciente com ID " + pacienteId + " não está na fila com ID " + filaId));
    }

    public String buscarNomePacientePorId(Long pacienteId) {
        Paciente paciente = pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new EntityNotFoundException("Paciente não encontrado com ID: " + pacienteId));
        return paciente.getNome();
    }

    public List<FilaPacienteDTO> listarFilaOrdenada(Long filaId) {
        List<FilaPaciente> filaPacientes = filaPacienteRepository.findByFilaIdAndAtendidoFalseOrderByPosicao(filaId);

        if (filaPacientes.isEmpty()) {
            throw new EntityNotFoundException("Nenhum paciente encontrado na fila com ID: " + filaId);
        }

        return filaPacientes.stream()
                .map(fp -> new FilaPacienteDTO(
                        fp.getPaciente().getId(),
                        fp.getPaciente().getNome(),
                        fp.getPosicao(),
                        fp.getAtendido()
                ))
                .collect(Collectors.toList());
    }

    public List<Fila> listarFilasAtivas() {
        return filaRepository.findByAtivoTrue();
    }

    public Fila atualizarPrioridadeETempoMedio(Long filaId, Integer prioridade, Double tempoMedio) {
        Fila fila = filaRepository.findById(filaId)
                .orElseThrow(() -> new EntityNotFoundException("Fila não encontrada com ID: " + filaId));

        fila.setPrioridade(prioridade);
        fila.setTempoMedio(tempoMedio);
        return filaRepository.save(fila);
    }

    public void deletarFila(Long filaId) {
        Fila fila = filaRepository.findById(filaId)
                .orElseThrow(() -> new EntityNotFoundException("Fila não encontrada com ID: " + filaId));
        fila.setAtivo(false);
        filaRepository.save(fila);
    }
}
