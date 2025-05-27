package com.medqueue.medqueue.service.admin;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.medqueue.medqueue.dto.FilaPacienteDTO;
import com.medqueue.medqueue.dto.HistoricoFilaDTO;
import com.medqueue.medqueue.dto.HistoricoPacienteAdminDTO;
import com.medqueue.medqueue.models.Fila;
import com.medqueue.medqueue.models.FilaPaciente;
import com.medqueue.medqueue.models.Paciente;
import com.medqueue.medqueue.repository.FilaPacienteRepository;
import com.medqueue.medqueue.repository.FilaRepository;
import com.medqueue.medqueue.repository.PacienteRepository;
import com.medqueue.medqueue.service.paciente.WhatsAppService;
import com.medqueue.medqueue.util.FilaPacienteValidator;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FilaPacienteService {

    private final FilaPacienteRepository filaPacienteRepository;
    private final FilaRepository filaRepository;
    private final PacienteRepository pacienteRepository;
    private final WhatsAppService whatsAppService;

    @Transactional
    public void addPaciente(Long pacienteId, Long filaId, Integer prioridade) {
        FilaPacienteValidator.validarParametrosEntrarNaFila(pacienteId, filaId, prioridade);

        Paciente paciente = pacienteRepository.findById(pacienteId).orElse(null);
        Fila fila = filaRepository.findById(filaId).orElse(null);

        FilaPacienteValidator.verificarPacienteExistente(paciente, pacienteId);
        FilaPacienteValidator.verificarFilaExistente(fila, filaId);
        FilaPacienteValidator.verificarFilaAtiva(fila);

        verificarSePacientePodeEntrarNaFila(pacienteId);

        // Verificação específica para a fila atual (verificar se já existe na mesma fila)
        Optional<FilaPaciente> existente = filaPacienteRepository
                .findByPacienteIdAndFilaIdAndStatus(pacienteId, filaId, "Na fila");

        if (existente.isPresent()) {
            throw new IllegalStateException("Paciente já está na fila com ID: " + filaId);
        }

        int posicao = filaPacienteRepository.findByFilaIdAndStatusOrderByPosicao(filaId, "Na fila").size() + 1;

        if (prioridade != 3) {
            atualizarPosicao(filaId);
        }

        FilaPaciente filaPaciente = new FilaPaciente();
        filaPaciente.setPaciente(paciente);
        filaPaciente.setFila(fila);
        filaPaciente.setPosicao(posicao);
        filaPaciente.setStatus("Na fila");
        filaPaciente.setDataEntrada(LocalDateTime.now());
        filaPaciente.setPrioridade(prioridade);

        filaPacienteRepository.save(filaPaciente);

        // Enviar mensagem de boas-vindas
        enviarMensagemBoasVindas(paciente, posicao);
    }

    public List<FilaPaciente> listarPacientes(Long filaId) {

        FilaPacienteValidator.verificarIdExistente(filaId);

        Fila fila = filaRepository.findById(filaId).orElse(null);
        FilaPacienteValidator.verificarFilaExistente(fila, filaId);

        try {
            return filaPacienteRepository.findByFilaIdAndStatusOrderByPosicao(filaId, "Na fila");
        } catch (EntityNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao listar pacientes na fila: " + e.getMessage(), e);
        }
    }

    public List<FilaPacienteDTO> listarFilaOrdenada(Long filaId) {
        FilaPacienteValidator.verificarIdExistente(filaId);

        Fila fila = filaRepository.findById(filaId).orElse(null);
        FilaPacienteValidator.verificarFilaExistente(fila, filaId);

        try {
            List<FilaPaciente> filaPacientes = filaPacienteRepository.findByFilaIdOrderByPosicao(filaId);

            if (filaPacientes.isEmpty()) {
                return Collections.emptyList();
            }

            return filaPacientes.stream()
                    .map(fp -> new FilaPacienteDTO(
                    fp.getPaciente().getId(),
                    fp.getPaciente().getNome(),
                    fp.getPosicao(),
                    fp.getStatus(),
                    fp.getDataEntrada(),
                    fp.getCheckIn(),
                    fp.getPrioridade()))
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
    private void atualizarPosicao(Long filaId) {
        FilaPacienteValidator.verificarIdExistente(filaId);

        try {
            List<FilaPaciente> filaPacientesOrdenada = filaPacienteRepository.findByFilaIdAndStatusOrderByPrioridade(filaId, "Na fila");

            int posicao = 0;

            for (FilaPaciente filaPaciente : filaPacientesOrdenada) {
                posicao++;

                filaPaciente.setPosicao(posicao);
                filaPacienteRepository.save(filaPaciente);
            }

        } catch (EntityNotFoundException e) {
            throw e;
        }
    }

    @Transactional
    public FilaPacienteDTO realizarCheckIn(Long filaId, Long pacienteId) {
        FilaPacienteValidator.verificarIdExistente(filaId);
        FilaPacienteValidator.verificarIdExistente(pacienteId);

        Fila fila = filaRepository.findById(filaId).orElse(null);
        FilaPacienteValidator.verificarFilaExistente(fila, filaId);

        // Buscar TODOS os registros do paciente na fila
        List<FilaPaciente> registrosPaciente = filaPacienteRepository.findByPacienteIdAndFilaId(pacienteId, filaId);

        if (registrosPaciente.isEmpty()) {
            throw new EntityNotFoundException("Paciente não está na fila");
        }

        // Buscar o registro mais recente com status "Na fila" ou "Atrasado"
        Optional<FilaPaciente> registroAtivo = registrosPaciente.stream()
                .filter(fp -> "Na fila".equals(fp.getStatus()) || "Atrasado".equals(fp.getStatus()))
                .max(Comparator.comparing(FilaPaciente::getDataEntrada));

        if (registroAtivo.isEmpty()) {
            throw new EntityNotFoundException("Paciente não está na fila com status que permite check-in");
        }

        FilaPaciente filaPaciente = registroAtivo.get();

        if (filaPaciente.getCheckIn()) {
            throw new IllegalStateException("Paciente já realizou check-in");
        }

        filaPaciente.setCheckIn(true);
        filaPaciente.setStatus("Em atendimento");
        filaPacienteRepository.save(filaPaciente);

        // Retorno correto do DTO
        return new FilaPacienteDTO(
                filaPaciente.getPaciente().getId(),
                filaPaciente.getPaciente().getNome(),
                filaPaciente.getPosicao(),
                filaPaciente.getStatus(),
                filaPaciente.getDataEntrada(),
                filaPaciente.getCheckIn(),
                filaPaciente.getPrioridade()
        );
    }

    @Transactional
    public FilaPacienteDTO atualizarStatusPaciente(Long filaId, Long pacienteId, String status) {
        FilaPacienteValidator.validarParametrosAtualizarStatus(filaId, pacienteId, status);
        FilaPacienteValidator.validarStatusPermitido(status);

        Fila fila = filaRepository.findById(filaId).orElse(null);

        FilaPacienteValidator.verificarFilaExistente(fila, filaId);
        FilaPacienteValidator.verificarFilaAtiva(fila);

        // Buscar TODOS os registros do paciente na fila
        List<FilaPaciente> registrosPaciente = filaPacienteRepository.findByPacienteIdAndFilaId(pacienteId, filaId);

        if (registrosPaciente.isEmpty()) {
            throw new EntityNotFoundException("Paciente com ID " + pacienteId + " não está na fila com ID " + filaId);
        }

        FilaPaciente filaPaciente = obterRegistroAtivo(registrosPaciente)
                .orElseThrow(() -> new EntityNotFoundException("Não há nenhum registro ativo do paciente na fila para atualizar status"));

        String statusAntigo = filaPaciente.getStatus();
        filaPaciente.setStatus(status);

        // Caso específico para qualquer tipo de status "Em atendimento"
        if (status.startsWith("Em atendimento")) {
            filaPaciente.setCheckIn(true);
        }

        // Se mudar para Atrasado ou Em atendimento e estava "Na fila",
        // precisamos reorganizar as posições
        if (("Atrasado".equals(status) || "Em atendimento".equals(status)) && "Na fila".equals(statusAntigo)) {
            reorganizarFilaRestante(filaId, filaPaciente.getPosicao());
            notificarProximoDaFila(filaId, filaPaciente.getPosicao());
        }

        filaPacienteRepository.save(filaPaciente);

        return new FilaPacienteDTO(
                filaPaciente.getPaciente().getId(),
                filaPaciente.getPaciente().getNome(),
                filaPaciente.getPosicao(),
                filaPaciente.getStatus(),
                filaPaciente.getDataEntrada(),
                filaPaciente.getCheckIn(),
                filaPaciente.getPrioridade());
    }

    public HistoricoPacienteAdminDTO historicoFilaPacienteId(Long pacienteId) {

        var paciente = pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Paciente não encontrado."));

        List<FilaPaciente> filas = filaPacienteRepository.findAllByPacienteId(pacienteId);

        if (filas.isEmpty()) {
            throw new RuntimeException("O paciente ainda não possui histórico de filas.");
        }

        List<HistoricoFilaDTO> historicoFilas = filas.stream()
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

        return new HistoricoPacienteAdminDTO(paciente.getNome(), historicoFilas);
    }

    private Optional<FilaPaciente> obterRegistroAtivo(List<FilaPaciente> registrosPaciente) {
        return registrosPaciente.stream()
                .filter(fp -> !List.of("Atendido", "Atendido - Atrasado", "Removido").contains(fp.getStatus()))
                .max(Comparator.comparing(FilaPaciente::getDataEntrada));
    }

    private void reorganizarFilaRestante(Long filaId, int posicaoRemovida) {
        List<FilaPaciente> filaRestante = filaPacienteRepository.findByFilaIdAndStatusOrderByPosicao(filaId, "Na fila");
        for (FilaPaciente fp : filaRestante) {
            if (fp.getPosicao() > posicaoRemovida) {
                fp.setPosicao(fp.getPosicao() - 1);
                filaPacienteRepository.save(fp);
            }
        }
    }

    private void notificarProximoDaFila(Long filaId, int posicaoRemovida) {
        if (posicaoRemovida != 1) {
            return;
        }

        FilaPaciente novoProximo = filaPacienteRepository.findFirstByFilaIdAndStatusOrderByPosicao(filaId, "Na fila");
        if (novoProximo == null || Boolean.TRUE.equals(novoProximo.getNotificado())) {
            return;
        }

        try {
            String telefone = novoProximo.getPaciente().getTelefone();
            String primeiroNome = novoProximo.getPaciente().getNome().split(" ")[0];
            String mensagem = String.format(
                    "👋 Olá %s! Aqui é da equipe *MedQueue* 🏥\n\n"
                    + "Você é o *próximo da fila* para ser atendido! 🔔\n"
                    + "Fique atento e se prepare para o seu atendimento.\n\n"
                    + "Agradecemos pela sua paciência! 😊",
                    primeiroNome
            );

            whatsAppService.sendWhatsAppMessage(telefone, mensagem);
            novoProximo.setNotificado(true);
            filaPacienteRepository.save(novoProximo);
        } catch (Exception e) {
            System.err.println("Erro ao enviar WhatsApp: " + e.getMessage());
        }
    }

    private void verificarSePacientePodeEntrarNaFila(Long pacienteId) {
        List<FilaPaciente> registros = filaPacienteRepository.findAllByPacienteId(pacienteId);

        boolean emFilaAtiva = registros.stream().anyMatch(fp
                -> fp.getFila().getAtivo()
                && !fp.getStatus().equals("Atendido")
                && !fp.getStatus().equals("Atendido - Atrasado")
        );

        if (emFilaAtiva) {
            throw new IllegalStateException("Paciente já está em uma fila ativa e ainda não foi atendido.");
        }
    }

    private void enviarMensagemBoasVindas(Paciente paciente, int posicao) {
        try {
            String telefone = paciente.getTelefone();
            String primeiroNome = paciente.getNome().split(" ")[0];

            String mensagem = String.format(
                    "👋 Olá %s! Aqui é da equipe *MedQueue* 🏥\n\n"
                    + "Você entrou na fila com sucesso! 🎉\n"
                    + "Sua posição atual é: *%d*.\n"
                    + "Acompanhe seu status e fique atento para o seu atendimento.\n\n"
                    + "Agradecemos por utilizar o MedQueue! 😊",
                    primeiroNome, posicao
            );

            whatsAppService.sendWhatsAppMessage(telefone, mensagem);
        } catch (Exception e) {
            System.err.println("Erro ao enviar mensagem de boas-vindas: " + e.getMessage());
        }
    }
}
