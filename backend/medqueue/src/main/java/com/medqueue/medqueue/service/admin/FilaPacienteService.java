package com.medqueue.medqueue.service.admin;

import com.medqueue.medqueue.dto.FilaPacienteDTO;
import com.medqueue.medqueue.dto.FilaPrioridadeDTO;
import com.medqueue.medqueue.models.Fila;
import com.medqueue.medqueue.models.FilaPaciente;
import com.medqueue.medqueue.models.Paciente;
import com.medqueue.medqueue.repository.FilaPacienteRepository;
import com.medqueue.medqueue.repository.FilaRepository;
import com.medqueue.medqueue.repository.PacienteRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FilaPacienteService {

    private final FilaPacienteRepository filaPacienteRepository;
    private final FilaRepository filaRepository;
    private final PacienteRepository pacienteRepository;

    // Constantes para ajuste do algoritmo de prioridade
    private static final double PESO_PRIORIDADE = 1000.0; // Peso da prioridade da fila
    private static final double PESO_TEMPO_ESPERA = 5.0; // Peso do tempo de espera em minutos

    @Transactional
    public void addPaciente(Long pacienteId, Long filaId) {
        if (pacienteId == null) {
            throw new IllegalArgumentException("ID do paciente não pode ser nulo");
        }
        if (filaId == null) {
            throw new IllegalArgumentException("ID da fila não pode ser nulo");
        }

        try {
            Paciente paciente = pacienteRepository.findById(pacienteId)
                    .orElseThrow(() -> new EntityNotFoundException("Paciente não encontrado com ID: " + pacienteId));

            Fila fila = filaRepository.findById(filaId)
                    .orElseThrow(() -> new EntityNotFoundException("Fila não encontrada com ID: " + filaId));

            if (!fila.getAtivo()) {
                throw new IllegalStateException("Fila com ID " + filaId + " está inativa");
            }

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
            filaPaciente.setDataEntrada(LocalDateTime.now());

            filaPacienteRepository.save(filaPaciente);
        } catch (EntityNotFoundException | IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao adicionar paciente à fila: " + e.getMessage(), e);
        }
    }

    @Transactional
    public FilaPaciente atenderProximoPaciente(Long filaId) {
        if (filaId == null) {
            throw new IllegalArgumentException("ID da fila não pode ser nulo");
        }

        try {
            // Verifica se a fila existe
            if (!filaRepository.existsById(filaId)) {
                throw new EntityNotFoundException("Fila não encontrada com ID: " + filaId);
            }

            FilaPaciente filaPaciente = filaPacienteRepository.findFirstByFilaIdAndAtendidoFalseOrderByPosicao(filaId);
            if (filaPaciente == null) {
                throw new EntityNotFoundException("Nenhum paciente na fila com ID: " + filaId);
            }
            filaPaciente.setAtendido(true);

            // Reorganizar as posições dos pacientes restantes na fila
            List<FilaPaciente> filaRestante = filaPacienteRepository.findByFilaIdAndAtendidoFalseOrderByPosicao(filaId);
            for (FilaPaciente fp : filaRestante) {
                fp.setPosicao(fp.getPosicao() - 1);
                filaPacienteRepository.save(fp);
            }

            return filaPacienteRepository.save(filaPaciente);
        } catch (EntityNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao atender próximo paciente: " + e.getMessage(), e);
        }
    }

    public List<FilaPaciente> listarPacientes(Long filaId) {
        if (filaId == null) {
            throw new IllegalArgumentException("ID da fila não pode ser nulo");
        }

        try {
            // Verifica se a fila existe
            if (!filaRepository.existsById(filaId)) {
                throw new EntityNotFoundException("Fila não encontrada com ID: " + filaId);
            }

            return filaPacienteRepository.findByFilaIdAndAtendidoFalseOrderByPosicao(filaId);
        } catch (EntityNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao listar pacientes na fila: " + e.getMessage(), e);
        }
    }

    public FilaPaciente buscarPacienteNaFila(Long pacienteId, Long filaId) {
        if (pacienteId == null) {
            throw new IllegalArgumentException("ID do paciente não pode ser nulo");
        }
        if (filaId == null) {
            throw new IllegalArgumentException("ID da fila não pode ser nulo");
        }

        try {
            return filaPacienteRepository.findByPacienteIdAndFilaIdAndAtendidoFalse(pacienteId, filaId)
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Paciente com ID " + pacienteId + " não está na fila com ID " + filaId));
        } catch (EntityNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar paciente na fila: " + e.getMessage(), e);
        }
    }

    public String buscarNomePacientePorId(Long pacienteId) {
        if (pacienteId == null) {
            throw new IllegalArgumentException("ID do paciente não pode ser nulo");
        }

        try {
            Paciente paciente = pacienteRepository.findById(pacienteId)
                    .orElseThrow(() -> new EntityNotFoundException("Paciente não encontrado com ID: " + pacienteId));
            return paciente.getNome();
        } catch (EntityNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar nome do paciente: " + e.getMessage(), e);
        }
    }

    public List<FilaPacienteDTO> listarFilaOrdenada(Long filaId) {
        if (filaId == null) {
            throw new IllegalArgumentException("ID da fila não pode ser nulo");
        }

        try {
            // Verifica se a fila existe
            if (!filaRepository.existsById(filaId)) {
                throw new EntityNotFoundException("Fila não encontrada com ID: " + filaId);
            }

            List<FilaPaciente> filaPacientes = filaPacienteRepository
                    .findByFilaIdAndAtendidoFalseOrderByPosicao(filaId);

            if (filaPacientes.isEmpty()) {
                return Collections.emptyList();
            }

            return filaPacientes.stream()
                    .map(fp -> new FilaPacienteDTO(
                            fp.getPaciente().getId(),
                            fp.getPaciente().getNome(),
                            fp.getPosicao(),
                            fp.getAtendido(),
                            fp.getDataEntrada(),
                            fp.getCheckIn()))
                    .collect(Collectors.toList());
        } catch (EntityNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao listar fila ordenada: " + e.getMessage(), e);
        }
    }

    public List<Fila> listarFilasAtivas() {
        try {
            return filaRepository.findByAtivoTrue();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao listar filas ativas: " + e.getMessage(), e);
        }
    }

    @Transactional
    public Fila atualizarPrioridadeETempoMedio(Long filaId, Integer prioridade, Double tempoMedio) {
        if (filaId == null) {
            throw new IllegalArgumentException("ID da fila não pode ser nulo");
        }
        if (prioridade != null && prioridade < 0) {
            throw new IllegalArgumentException("Prioridade não pode ser negativa");
        }
        if (tempoMedio != null && tempoMedio < 0) {
            throw new IllegalArgumentException("Tempo médio não pode ser negativo");
        }

        try {
            Fila fila = filaRepository.findById(filaId)
                    .orElseThrow(() -> new EntityNotFoundException("Fila não encontrada com ID: " + filaId));

            if (prioridade != null) {
                fila.setPrioridade(prioridade);
            }
            if (tempoMedio != null) {
                fila.setTempoMedio(tempoMedio);
            }
            return filaRepository.save(fila);
        } catch (EntityNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao atualizar prioridade e tempo médio: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void deletarFila(Long filaId) {
        if (filaId == null) {
            throw new IllegalArgumentException("ID da fila não pode ser nulo");
        }

        try {
            Fila fila = filaRepository.findById(filaId)
                    .orElseThrow(() -> new EntityNotFoundException("Fila não encontrada com ID: " + filaId));

            // Correção: substituir findByFilaIdAndAtendidoFalse por
            // findByFilaIdAndAtendidoFalseOrderByPosicao
            List<FilaPaciente> pacientesNaFila = filaPacienteRepository
                    .findByFilaIdAndAtendidoFalseOrderByPosicao(filaId);
            if (!pacientesNaFila.isEmpty()) {
                throw new IllegalStateException("Não é possível deletar fila com pacientes pendentes");
            }

            fila.setAtivo(false);
            filaRepository.save(fila);
        } catch (EntityNotFoundException | IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao deletar fila: " + e.getMessage(), e);
        }
    }

    /**
     * Busca o próximo paciente a ser atendido considerando o sistema de prioridades
     * Prioridade 3 > Prioridade 2 > Prioridade 1
     * Em caso de mesma prioridade, considera-se o tempo de espera
     * 
     * @return O próximo paciente para atendimento ou null se não houver pacientes
     */
    @Transactional(readOnly = true)
    public FilaPacienteDTO buscarProximoPaciente() {
        try {
            // Buscar todos os pacientes em filas ativas que não foram atendidos
            List<FilaPaciente> todosPacientes = new ArrayList<>();
            List<Fila> filasAtivas = filaRepository.findByAtivoTrue();

            for (Fila fila : filasAtivas) {
                List<FilaPaciente> pacientesNaFila = filaPacienteRepository
                        .findByFilaIdAndAtendidoFalseOrderByPosicao(fila.getId());
                todosPacientes.addAll(pacientesNaFila);
            }

            if (todosPacientes.isEmpty()) {
                return null;
            }

            // Calcular score de prioridade para cada paciente
            FilaPaciente proximoPaciente = calcularProximoPaciente(todosPacientes);

            if (proximoPaciente == null) {
                return null;
            }

            return new FilaPacienteDTO(
                    proximoPaciente.getPaciente().getId(),
                    proximoPaciente.getPaciente().getNome(),
                    proximoPaciente.getPosicao(),
                    proximoPaciente.getAtendido(),
                    proximoPaciente.getDataEntrada(),
                    proximoPaciente.getCheckIn());

        } catch (Exception e) {
            throw new RuntimeException("Erro ao buscar próximo paciente para atendimento: " + e.getMessage(), e);
        }
    }

    /**
     * Calcula qual paciente deve ser o próximo a ser atendido baseado no sistema de
     * prioridades
     * 
     * @param pacientes Lista de pacientes em espera em todas as filas
     * @return O paciente com maior score de prioridade
     */
    private FilaPaciente calcularProximoPaciente(List<FilaPaciente> pacientes) {
        if (pacientes == null || pacientes.isEmpty()) {
            return null;
        }

        LocalDateTime agora = LocalDateTime.now();

        // Calcular o score para cada paciente e encontrar o maior
        FilaPaciente pacientePrioritario = null;
        double maiorScore = -1;

        for (FilaPaciente paciente : pacientes) {
            // Obter a prioridade da fila (1, 2 ou 3)
            int prioridadeFila = paciente.getFila().getPrioridade();

            // Calcular o tempo de espera em minutos
            // Verificamos se o campo createdAt existe, se não, usamos a data atual como
            // fallback
            LocalDateTime dataCriacao = paciente.getCreatedAt() != null ? paciente.getCreatedAt() : LocalDateTime.now();
            long tempoEsperaMinutos = ChronoUnit.MINUTES.between(dataCriacao, agora);

            // Calcular o score de prioridade
            // Fórmula: (Prioridade da Fila * PESO_PRIORIDADE) + (Tempo de Espera *
            // PESO_TEMPO_ESPERA)
            double score = (prioridadeFila * PESO_PRIORIDADE) + (tempoEsperaMinutos * PESO_TEMPO_ESPERA);

            // Se este paciente tem um score maior que o atual maior, ele se torna o
            // prioritário
            if (score > maiorScore) {
                maiorScore = score;
                pacientePrioritario = paciente;
            }
        }

        return pacientePrioritario;
    }

    /**
     * Busca todos os pacientes em todas as filas com suas informações de prioridade
     * 
     * @return Lista de pacientes com informações de fila e prioridade
     */
    public List<FilaPrioridadeDTO> listarTodosPacientesComPrioridade() {
        try {
            List<FilaPrioridadeDTO> resultado = new ArrayList<>();
            List<Fila> filasAtivas = filaRepository.findByAtivoTrue();
            LocalDateTime agora = LocalDateTime.now();

            for (Fila fila : filasAtivas) {
                List<FilaPaciente> pacientesNaFila = filaPacienteRepository
                        .findByFilaIdAndAtendidoFalseOrderByPosicao(fila.getId());

                for (FilaPaciente paciente : pacientesNaFila) {
                    int prioridadeFila = fila.getPrioridade();

                    // Verificamos se o campo createdAt existe
                    LocalDateTime dataCriacao = paciente.getCreatedAt() != null ? paciente.getCreatedAt()
                            : LocalDateTime.now();
                    long tempoEsperaMinutos = ChronoUnit.MINUTES.between(dataCriacao, agora);

                    double score = (prioridadeFila * PESO_PRIORIDADE) + (tempoEsperaMinutos * PESO_TEMPO_ESPERA);

                    resultado.add(new FilaPrioridadeDTO(
                            paciente.getPaciente().getId(),
                            paciente.getPaciente().getNome(),
                            fila.getId(),
                            fila.getNome(),
                            prioridadeFila,
                            paciente.getPosicao(),
                            tempoEsperaMinutos,
                            score));
                }
            }

            // Ordenar pela pontuação (score) de forma decrescente
            resultado.sort((p1, p2) -> Double.compare(p2.getScore(), p1.getScore()));

            return resultado;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao listar pacientes com prioridade: " + e.getMessage(), e);
        }
    }

    /**
     * Atualiza as prioridades de todas as filas ativas para reequilibrar o sistema
     */
    @Transactional
    public void rebalancearPrioridades() {
        try {
            List<Fila> filas = filaRepository.findByAtivoTrue();

            // Implementação de algoritmo para reequilibrar prioridades
            // Por exemplo: filas com muitos pacientes podem receber prioridade maior
            for (Fila fila : filas) {
                int quantidadePacientes = filaPacienteRepository
                        .findByFilaIdAndAtendidoFalseOrderByPosicao(fila.getId()).size();

                // Ajuste baseado na quantidade de pacientes (exemplo simples)
                if (quantidadePacientes > 20) {
                    // Filas muito cheias recebem maior prioridade para evitar acúmulo
                    fila.setPrioridade(3);
                } else if (quantidadePacientes > 10) {
                    fila.setPrioridade(2);
                } else {
                    fila.setPrioridade(1);
                }

                filaRepository.save(fila);
            }
        } catch (Exception e) {
            throw new RuntimeException("Erro ao rebalancear prioridades: " + e.getMessage(), e);
        }
    }

    @Transactional
    public FilaPacienteDTO realizarCheckIn(Long filaId, Long pacienteId) {
        if (filaId == null) {
            throw new IllegalArgumentException("ID da fila não pode ser nulo");
        }
        if (pacienteId == null) {
            throw new IllegalArgumentException("ID do paciente não pode ser nulo");
        }

        try {
            if (!filaRepository.existsById(filaId)) {
                throw new EntityNotFoundException("Fila não encontrada com ID: " + filaId);
            }

            FilaPaciente filaPaciente = filaPacienteRepository
                    .findByPacienteIdAndFilaIdAndAtendidoFalse(pacienteId, filaId)
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Paciente com ID " + pacienteId + " não está na fila com ID " + filaId));

            if (filaPaciente.getCheckIn()) {
                throw new IllegalStateException("Paciente já realizou check-in");
            }

            filaPaciente.setCheckIn(true);
            FilaPaciente saved = filaPacienteRepository.save(filaPaciente);

            return new FilaPacienteDTO(
                    saved.getPaciente().getId(),
                    saved.getPaciente().getNome(),
                    saved.getPosicao(),
                    saved.getAtendido(),
                    saved.getDataEntrada(),
                    saved.getCheckIn());
        } catch (EntityNotFoundException | IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao realizar check-in do paciente: " + e.getMessage(), e);
        }
    }
}
