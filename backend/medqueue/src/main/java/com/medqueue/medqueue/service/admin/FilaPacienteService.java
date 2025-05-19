package com.medqueue.medqueue.service.admin;

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

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FilaPacienteService {

    private final FilaPacienteRepository filaPacienteRepository;
    private final FilaRepository filaRepository;
    private final PacienteRepository pacienteRepository;
    private final WhatsAppService whatsAppService;

    @Transactional
    public void addPaciente(Long pacienteId, Long filaId, Integer prioridade) {

        if (pacienteId == null) {
            throw new IllegalArgumentException("ID do paciente não pode ser nulo");
        }
        if (filaId == null) {
            throw new IllegalArgumentException("ID da fila não pode ser nulo");
        }
        if (prioridade == null) {
            throw new IllegalArgumentException("Prioridade não pode ser nula");
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
                    .findByPacienteIdAndFilaIdAndStatus(pacienteId, filaId, "Na fila");

            if (existente.isPresent()) {
                throw new IllegalStateException("Paciente já está na fila com ID: " + filaId);
            }

            int posicao = filaPacienteRepository.findByFilaIdAndStatusOrderByPosicao(filaId, "Na fila").size() + 1;
          
            FilaPaciente filaPaciente = new FilaPaciente();
            filaPaciente.setPaciente(paciente);
            filaPaciente.setFila(fila);
            filaPaciente.setPosicao(posicao);
            filaPaciente.setStatus("Na fila");
            filaPaciente.setDataEntrada(LocalDateTime.now());
            filaPaciente.setPrioridade(prioridade);

            filaPacienteRepository.save(filaPaciente);

            if (prioridade != 3) {
                atualizarPosicao(filaId);
            }
          
            // Enviar mensagem de boas-vindas
            try {
                String telefone = paciente.getTelefone();
                String primeiroNome = paciente.getNome().split(" ")[0];

                String mensagem = String.format(
                        "👋 Olá %s! Aqui é da equipe *MedQueue* 🏥\n\nVocê entrou na fila com sucesso! 🎉\nSua posição atual é: *%d*.\nAcompanhe seu status e fique atento para o seu atendimento.\n\nAgradecemos por utilizar o MedQueue! 😊",
                        primeiroNome, posicao
                );

                whatsAppService.sendWhatsAppMessage(telefone, mensagem);
            } catch (Exception e) {
                System.err.println("Erro ao enviar mensagem de boas-vindas ao paciente: " + e.getMessage());
            }
        } catch (EntityNotFoundException | IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao adicionar paciente à fila: " + e.getMessage(), e);
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

            return filaPacienteRepository.findByFilaIdAndStatusOrderByPosicao(filaId, "Na fila");
        } catch (EntityNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao listar pacientes na fila: " + e.getMessage(), e);
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
                    .findByFilaIdOrderByPosicao(filaId);

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
    public void atualizarPosicao(Long filaId) {
        if (filaId == null) {
            throw new IllegalArgumentException("ID da fila não pode ser nulo");
        }

        try {
            List<FilaPaciente> filaPacientesOrdenada = filaPacienteRepository.findByFilaIdAndStatusOrderByPrioridade(filaId, "Na fila");

            int cont = 0;

            for (FilaPaciente filaPaciente : filaPacientesOrdenada) {
                cont++;

                filaPaciente.setPosicao(cont);
                filaPacienteRepository.save(filaPaciente);
            }

        } catch (EntityNotFoundException e) {
            throw e;
            // ajeitar isso incliuir mensagem tirar catch de baixo
        // } catch (Exception e) {
        //     throw new RuntimeException("Erro ao atualizar prioridade e tempo médio: " + e.getMessage(), e);
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

            FilaPaciente filaPaciente = null;

            FilaPaciente paciente = filaPacienteRepository.findByPacienteIdAndFilaId(pacienteId, filaId)
                            .orElseThrow(() -> new EntityNotFoundException("Esse paciente não está na fila"));
            
            if ("Na fila".equals(paciente.getStatus())) {
                filaPaciente = filaPacienteRepository
                    .findByPacienteIdAndFilaIdAndStatus(pacienteId, filaId, "Na fila")
                    .orElseThrow(() -> new EntityNotFoundException(
                    "Paciente com ID " + pacienteId + " não está na fila com ID " + filaId));                
            } else {
                filaPaciente = filaPacienteRepository
                    .findByPacienteIdAndFilaIdAndStatus(pacienteId, filaId, "Atrasado")
                    .orElseThrow(() -> new EntityNotFoundException(
                    "Paciente com ID " + pacienteId + " não está na fila com ID " + filaId));
            }

            if (filaPaciente.getCheckIn()) {
                throw new IllegalStateException("Paciente já realizou check-in");
            }

            filaPaciente.setCheckIn(true);
            filaPaciente.setStatus("Em atendimento");
            filaPacienteRepository.save(filaPaciente);

            // Reorganizar posições: apenas dos que ainda não fizeram check-in e ainda não foram atendidos
            List<FilaPaciente> filaRestante = filaPacienteRepository
                    .findByFilaIdAndStatusAndCheckInFalseOrderByPosicao(filaId, "Na fila");

            int novaPosicao = 1;
            for (FilaPaciente fp : filaRestante) {
                fp.setPosicao(novaPosicao++);

                // Se ele está na posição 1 e ainda não foi notificado
                if (fp.getPosicao() == 1 && !Boolean.TRUE.equals(fp.getNotificado())) {
                    try {
                        String telefone = fp.getPaciente().getTelefone();
                        String primeiroNome = fp.getPaciente().getNome().split(" ")[0];

                        String mensagem = String.format(
                                "👋 Olá %s! Aqui é da equipe *MedQueue* 🏥\n\nVocê é o *próximo da fila* à ser atendido! 🔔\nFique atento e se prepare para o seu atendimento.\n\nAgradecemos pela sua paciência! 😊",
                                primeiroNome
                        );

                        whatsAppService.sendWhatsAppMessage(telefone, mensagem);
                        fp.setNotificado(true);
                    } catch (Exception e) {
                        System.err.println("Erro ao enviar WhatsApp para o paciente na posição 1: " + e.getMessage());
                    }
                }

                filaPacienteRepository.save(fp);
            }

            return new FilaPacienteDTO(
                    filaPaciente.getPaciente().getId(),
                    filaPaciente.getPaciente().getNome(),
                    filaPaciente.getPosicao(),
                    filaPaciente.getStatus(),
                    filaPaciente.getDataEntrada(),
                    filaPaciente.getCheckIn(),
                    filaPaciente.getPrioridade());

        } catch (EntityNotFoundException | IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao realizar check-in do paciente: " + e.getMessage(), e);
        }
    }

    @Transactional
    public FilaPacienteDTO atualizarStatusPaciente(Long filaId, Long pacienteId, String status) {
        if (filaId == null) {
            throw new IllegalArgumentException("ID da fila não pode ser nulo");
        }
        if (pacienteId == null) {
            throw new IllegalArgumentException("ID do paciente não pode ser nulo");
        }
        if (status == null || status.isEmpty()) {
            throw new IllegalArgumentException("Status não pode ser nulo ou vazio");
        }

        try {
            // Lista de status permitidos
            List<String> statusPermitidos = Arrays.asList(
                "Na fila", "Atendido", "Atrasado", "Em atendimento", "Em atendimento - Atrasado", 
                "Atendido - Atrasado", "Removido"
            );
            if (!statusPermitidos.contains(status)) {
                throw new IllegalArgumentException("Status inválido: " + status);
            }

            // Verificar se a fila existe
            if (!filaRepository.existsById(filaId)) {
                throw new EntityNotFoundException("Fila não encontrada com ID: " + filaId);
            }

            // Buscar o paciente na fila
            Optional<FilaPaciente> filaPacienteOpt = filaPacienteRepository.findByPacienteIdAndFilaId(pacienteId, filaId);
            
            if (!filaPacienteOpt.isPresent()) {
                throw new EntityNotFoundException("Paciente com ID " + pacienteId + " não está na fila com ID " + filaId);
            }
            
            FilaPaciente filaPaciente = filaPacienteOpt.get();
            String statusAntigo = filaPaciente.getStatus();
            filaPaciente.setStatus(status);
            
            // Caso específico para qualquer tipo de status "Em atendimento"
            if (status.startsWith("Em atendimento")) {
                filaPaciente.setCheckIn(true);
            }
            
            // Se mudar para Atrasado ou Em atendimento e estava "Na fila",
            // precisamos reorganizar as posições
            if (("Atrasado".equals(status) || "Em atendimento".equals(status)) 
                && "Na fila".equals(statusAntigo)) {
                int posicaoAntiga = filaPaciente.getPosicao();
                
                // Reorganizar posições
                List<FilaPaciente> filaRestante = filaPacienteRepository
                    .findByFilaIdAndStatusOrderByPosicao(filaId, "Na fila");
                for (FilaPaciente fp : filaRestante) {
                    if (fp.getPosicao() > posicaoAntiga) {
                        fp.setPosicao(fp.getPosicao() - 1);
                        filaPacienteRepository.save(fp);
                    }
                }
                
                // Notificar o novo primeiro da fila
                if (posicaoAntiga == 1) {
                    FilaPaciente novoProximo = filaPacienteRepository
                        .findFirstByFilaIdAndStatusOrderByPosicao(filaId, "Na fila");
                    if (novoProximo != null && !Boolean.TRUE.equals(novoProximo.getNotificado())) {
                        try {
                            String telefone = novoProximo.getPaciente().getTelefone();
                            String primeiroNome = novoProximo.getPaciente().getNome().split(" ")[0];
                            
                            String mensagem = String.format(
                                "👋 Olá %s! Aqui é da equipe *MedQueue* 🏥\n\n" +
                                "Você é o *próximo da fila* para ser atendido! 🔔\n" +
                                "Fique atento e se prepare para o seu atendimento.\n\n" +
                                "Agradecemos pela sua paciência! 😊",
                                primeiroNome
                            );
                            
                            whatsAppService.sendWhatsAppMessage(telefone, mensagem);
                            novoProximo.setNotificado(true);
                            filaPacienteRepository.save(novoProximo);
                        } catch (Exception e) {
                            System.err.println("Erro ao enviar WhatsApp: " + e.getMessage());
                        }
                    }
                }
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
                
        } catch (EntityNotFoundException | IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao atualizar status do paciente: " + e.getMessage(), e);
        }
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

}
