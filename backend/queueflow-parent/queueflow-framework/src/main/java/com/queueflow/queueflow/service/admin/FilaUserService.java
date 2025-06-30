package com.queueflow.queueflow.service.admin;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import com.queueflow.queueflow.factory.UserFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.queueflow.queueflow.dto.FilaUserDTO;
import com.queueflow.queueflow.dto.HistoricoFilaDTO;
import com.queueflow.queueflow.dto.HistoricoUserAdminDTO;
import com.queueflow.queueflow.models.Fila;
import com.queueflow.queueflow.models.FilaUser;
import com.queueflow.queueflow.models.User;
import com.queueflow.queueflow.repository.FilaUserRepository;
import com.queueflow.queueflow.repository.FilaRepository;
import com.queueflow.queueflow.repository.UserRepository;
import com.queueflow.queueflow.service.user.WhatsAppService;
import com.queueflow.queueflow.util.FilaUserValidator;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FilaUserService<T extends User> {
    
    private final UserFactory userFactory;
    private final FilaUserRepository filaUserRepository;
    private final FilaRepository filaRepository;
    private final UserRepository<T> userRepository;
    private final WhatsAppService whatsAppService;

    @Transactional
    public void addUser(Long userId, Long filaId, Integer prioridade) {
        FilaUserValidator.validarParametrosEntrarNaFila(userId, filaId, prioridade);

        T user = userRepository.findById(userId).orElse(null);
        Fila fila = filaRepository.findById(filaId).orElse(null);

        FilaUserValidator.verificarUserExistente(user, userId);
        FilaUserValidator.verificarFilaExistente(fila, filaId);
        FilaUserValidator.verificarFilaAtiva(fila);

        verificarSeUserPodeEntrarNaFila(userId);

        // Verificação específica para a fila atual (verificar se já existe na mesma fila)
        Optional<FilaUser> existente = filaUserRepository
                .findByUserIdAndFilaIdAndStatus(userId, filaId, "Na fila");

        if (existente.isPresent()) {
            throw new IllegalStateException("User já está na fila com ID: " + filaId);
        }

        int posicao = filaUserRepository.findByFilaIdAndStatusOrderByPosicao(filaId, "Na fila").size() + 1;

        if (prioridade != 3) {
            atualizarPosicao(filaId);
        }

        FilaUser filaUser = new FilaUser();
        filaUser.setUser(user);
        filaUser.setFila(fila);
        filaUser.setPosicao(posicao);
        filaUser.setStatus("Na fila");
        filaUser.setDataEntrada(LocalDateTime.now());
        filaUser.setPrioridade(prioridade);

        filaUserRepository.save(filaUser);

        // Enviar mensagem de boas-vindas
        enviarMensagemBoasVindas(user, posicao);
    }

    public List<FilaUser> listarUsers(Long filaId) {

        FilaUserValidator.verificarIdExistente(filaId);

        Fila fila = filaRepository.findById(filaId).orElse(null);
        FilaUserValidator.verificarFilaExistente(fila, filaId);

        try {
            return filaUserRepository.findByFilaIdAndStatusOrderByPosicao(filaId, "Na fila");
        } catch (EntityNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao listar users na fila: " + e.getMessage(), e);
        }
    }

    public List<FilaUserDTO> listarFilaOrdenada(Long filaId) {
        FilaUserValidator.verificarIdExistente(filaId);

        Fila fila = filaRepository.findById(filaId).orElse(null);
        FilaUserValidator.verificarFilaExistente(fila, filaId);

        try {
            List<FilaUser> filaUsers = filaUserRepository.findByFilaIdOrderByPosicao(filaId);

            if (filaUsers.isEmpty()) {
                return Collections.emptyList();
            }

            return filaUsers.stream()
                    .map(fp -> new FilaUserDTO(
                    fp.getUser().getId(),
                    fp.getUser().getNome(),
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
        FilaUserValidator.verificarIdExistente(filaId);

        try {
            List<FilaUser> filaUsersOrdenada = filaUserRepository.findByFilaIdAndStatusOrderByPrioridade(filaId, "Na fila");

            int posicao = 0;

            for (FilaUser filaUser : filaUsersOrdenada) {
                posicao++;

                filaUser.setPosicao(posicao);
                filaUserRepository.save(filaUser);
            }

        } catch (EntityNotFoundException e) {
            throw e;
        }
    }

    @Transactional
    public FilaUserDTO realizarCheckIn(Long filaId, Long userId) {
        FilaUserValidator.verificarIdExistente(filaId);
        FilaUserValidator.verificarIdExistente(userId);

        Fila fila = filaRepository.findById(filaId).orElse(null);
        FilaUserValidator.verificarFilaExistente(fila, filaId);

        // Buscar TODOS os registros do user na fila
        List<FilaUser> registrosUser = filaUserRepository.findByUserIdAndFilaId(userId, filaId);

        if (registrosUser.isEmpty()) {
            throw new EntityNotFoundException("User não está na fila");
        }

        // Buscar o registro mais recente com status "Na fila" ou "Atrasado"
        Optional<FilaUser> registroAtivo = registrosUser.stream()
                .filter(fp -> "Na fila".equals(fp.getStatus()) || "Atrasado".equals(fp.getStatus()))
                .max(Comparator.comparing(FilaUser::getDataEntrada));

        if (registroAtivo.isEmpty()) {
            throw new EntityNotFoundException("User não está na fila com status que permite check-in");
        }

        FilaUser filaUser = registroAtivo.get();

        if (filaUser.getCheckIn()) {
            throw new IllegalStateException("User já realizou check-in");
        }

        filaUser.setCheckIn(true);
        filaUser.setStatus("Em atendimento");
        filaUserRepository.save(filaUser);

        // Retorno correto do DTO
        return new FilaUserDTO(
                filaUser.getUser().getId(),
                filaUser.getUser().getNome(),
                filaUser.getPosicao(),
                filaUser.getStatus(),
                filaUser.getDataEntrada(),
                filaUser.getCheckIn(),
                filaUser.getPrioridade()
        );
    }

    @Transactional
    public FilaUserDTO atualizarStatusUser(Long filaId, Long userId, String status) {
        FilaUserValidator.validarParametrosAtualizarStatus(filaId, userId, status);
        FilaUserValidator.validarStatusPermitido(status);

        Fila fila = filaRepository.findById(filaId).orElse(null);

        FilaUserValidator.verificarFilaExistente(fila, filaId);
        FilaUserValidator.verificarFilaAtiva(fila);

        // Buscar TODOS os registros do user na fila
        List<FilaUser> registrosUser = filaUserRepository.findByUserIdAndFilaId(userId, filaId);

        if (registrosUser.isEmpty()) {
            throw new EntityNotFoundException("User com ID " + userId + " não está na fila com ID " + filaId);
        }

        FilaUser filaUser = obterRegistroAtivo(registrosUser)
                .orElseThrow(() -> new EntityNotFoundException("Não há nenhum registro ativo do user na fila para atualizar status"));

        String statusAntigo = filaUser.getStatus();
        filaUser.setStatus(status);

        // Caso específico para qualquer tipo de status "Em atendimento"
        if (status.startsWith("Em atendimento")) {
            filaUser.setCheckIn(true);
        }

        // Se mudar para Atrasado ou Em atendimento e estava "Na fila",
        // precisamos reorganizar as posições
        if (("Atrasado".equals(status) || "Em atendimento".equals(status)) && "Na fila".equals(statusAntigo)) {
            reorganizarFilaRestante(filaId, filaUser.getPosicao());
            notificarProximoDaFila(filaId, filaUser.getPosicao());
        }

        filaUserRepository.save(filaUser);

        return new FilaUserDTO(
                filaUser.getUser().getId(),
                filaUser.getUser().getNome(),
                filaUser.getPosicao(),
                filaUser.getStatus(),
                filaUser.getDataEntrada(),
                filaUser.getCheckIn(),
                filaUser.getPrioridade());
    }

    public HistoricoUserAdminDTO historicoFilaUserId(Long userId) {

        T user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User não encontrado."));

        List<FilaUser> filas = filaUserRepository.findAllByUserId(userId);

        if (filas.isEmpty()) {
            throw new RuntimeException("O user ainda não possui histórico de filas.");
        }

        List<HistoricoFilaDTO> historicoFilas = filas.stream()
                .filter(filaUser -> filaUser.getFila() != null)
                .map(filaUser -> new HistoricoFilaDTO(
                filaUser.getFila().getId(),
                filaUser.getFila().getNome(),
                filaUser.getFila().getEspecialidade(),
                filaUser.getPrioridade(),
                filaUser.getStatus(),
                filaUser.getDataEntrada()
        ))
                .collect(Collectors.toList());

        return new HistoricoUserAdminDTO(user.getNome(), historicoFilas);
    }

    private Optional<FilaUser> obterRegistroAtivo(List<FilaUser> registrosUser) {
        return registrosUser.stream()
                .filter(fp -> !List.of("Atendido", "Atendido - Atrasado", "Removido").contains(fp.getStatus()))
                .max(Comparator.comparing(FilaUser::getDataEntrada));
    }

    private void reorganizarFilaRestante(Long filaId, int posicaoRemovida) {
        List<FilaUser> filaRestante = filaUserRepository.findByFilaIdAndStatusOrderByPosicao(filaId, "Na fila");
        for (FilaUser fp : filaRestante) {
            if (fp.getPosicao() > posicaoRemovida) {
                fp.setPosicao(fp.getPosicao() - 1);
                filaUserRepository.save(fp);
            }
        }
    }

    private void notificarProximoDaFila(Long filaId, int posicaoRemovida) {
        if (posicaoRemovida != 1) {
            return;
        }

        FilaUser novoProximo = filaUserRepository.findFirstByFilaIdAndStatusOrderByPosicao(filaId, "Na fila");
        if (novoProximo == null || Boolean.TRUE.equals(novoProximo.getNotificado())) {
            return;
        }

        try {
            String telefone = novoProximo.getUser().getTelefone();
            String primeiroNome = novoProximo.getUser().getNome().split(" ")[0];
            String mensagem = String.format(
                    "👋 Olá %s! Aqui é da equipe *MedQueue* 🏥\n\n"
                    + "Você é o *próximo da fila* para ser atendido! 🔔\n"
                    + "Fique atento e se prepare para o seu atendimento.\n\n"
                    + "Agradecemos pela sua paciência! 😊",
                    primeiroNome
            );

            whatsAppService.sendWhatsAppMessage(telefone, mensagem);
            novoProximo.setNotificado(true);
            filaUserRepository.save(novoProximo);
        } catch (Exception e) {
            System.err.println("Erro ao enviar WhatsApp: " + e.getMessage());
        }
    }

    private void verificarSeUserPodeEntrarNaFila(Long userId) {
        List<FilaUser> registros = filaUserRepository.findAllByUserId(userId);

        boolean emFilaAtiva = registros.stream().anyMatch(fp
                -> fp.getFila().getAtivo()
                && !fp.getStatus().equals("Atendido")
                && !fp.getStatus().equals("Atendido - Atrasado")
        );

        if (emFilaAtiva) {
            throw new IllegalStateException("User já está em uma fila ativa e ainda não foi atendido.");
        }
    }

    private void enviarMensagemBoasVindas(T user, int posicao) {
        try {
            String telefone = user.getTelefone();
            String primeiroNome = user.getNome().split(" ")[0];

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
