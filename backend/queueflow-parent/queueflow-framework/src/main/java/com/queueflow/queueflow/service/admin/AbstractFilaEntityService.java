package com.queueflow.queueflow.service.admin;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.queueflow.queueflow.dto.FilaUserDTO;
import com.queueflow.queueflow.dto.HistoricoFilaDTO;
import com.queueflow.queueflow.dto.HistoricoUserAdminDTO;
import com.queueflow.queueflow.dto.QueueSubjectDTO;
import com.queueflow.queueflow.models.Fila;
import com.queueflow.queueflow.models.FilaUser;
import com.queueflow.queueflow.models.QueueSubject;
import com.queueflow.queueflow.repository.EntityRepository;
import com.queueflow.queueflow.repository.FilaRepository;
import com.queueflow.queueflow.repository.FilaUserRepository;
import com.queueflow.queueflow.service.user.WhatsAppService;
import com.queueflow.queueflow.strategy.QueueStrategy;
import com.queueflow.queueflow.util.FilaUserValidator;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public abstract class AbstractFilaEntityService<E, T extends QueueSubject, F extends FilaUserDTO, D extends FilaUser> {

    protected final QueueStrategy<T, D> queueStrategy;
    protected final FilaUserRepository<D> filaUserRepository;
    protected final FilaRepository filaRepository;
    protected final WhatsAppService whatsAppService;
    protected final EntityRepository<E> entityRepository;

    @Transactional
    public void addUser(QueueSubjectDTO queueSubjectDTO, String extraInfo, Integer prioridade) {
        Long entityId;

        if (extraInfo == null || extraInfo.isBlank()) {
            extraInfo = "Geral";
        }

        if (queueSubjectDTO.getEntityId() == null) {
            entityId = queueSubjectDTO.getUserId();
        } else {
            entityId = queueSubjectDTO.getEntityId();
        }

        Long filaId = getFilaComEspecialidade(extraInfo);

        FilaUserValidator.validarParametrosEntrarNaFila(entityId, filaId, prioridade);

        E entity = entityRepository.findById(entityId).orElse(null);
        Fila fila = filaRepository.findById(filaId).orElse(null);

        FilaUserValidator.verificarUserExistente(entity, entityId);
        FilaUserValidator.verificarFilaExistente(fila, filaId);
        FilaUserValidator.verificarFilaAtiva(fila);

        verificarSeUserPodeEntrarNaFila(entityId);

        // Verificação específica para a fila atual (verificar se já existe na mesma
        // fila)
        Optional<D> existente = queueStrategy.findEntityByFilaIdAndEntityIdAndStatus(filaId, entityId, "na fila");

        if (existente.isPresent()) {
            throw new IllegalStateException("User já está na fila com ID: " + filaId);
        }

        T subject = createQueueSubject(entity);

        // Primeiro inserir o usuário com posição temporária
        int posicaoTemporaria = filaUserRepository.findByFilaIdAndStatusOrderByPosicao(filaId, "Na fila").size() + 1;
        D filaUser = queueStrategy.queueEntry(fila, subject, prioridade, posicaoTemporaria);
        
        filaUserRepository.save(filaUser);

        // Depois reorganizar toda a fila por prioridade se necessário
        if (prioridade != 3) {
            atualizarPosicao(filaId);
        }

        enviarMensagemBoasVindas(entity, posicaoTemporaria);
    }

    public List<D> listarUsers(Long filaId) {

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

    public List<F> listarFilaOrdenada(Long filaId) {
        System.out.println("Entrou no service para listar a fila ordenada");
        FilaUserValidator.verificarIdExistente(filaId);

        Fila fila = filaRepository.findById(filaId).orElse(null);
        FilaUserValidator.verificarFilaExistente(fila, filaId);

        System.out.println(fila);

        try {
            List<D> filaUsers = filaUserRepository.findByFilaIdOrderByPosicao(filaId);

            if (filaUsers.isEmpty()) {
                return Collections.emptyList();
            }

            return filaUsers.stream()
                    .map(this::mapToFilaUserDTO)
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
    protected void atualizarPosicao(Long filaId) {
        FilaUserValidator.verificarIdExistente(filaId);

        try {
            List<D> filaUsersOrdenada = filaUserRepository.findByFilaIdAndStatusOrderByPrioridade(filaId,
                    "Na fila");

            int posicao = 0;

            for (D filaUser : filaUsersOrdenada) {
                posicao++;

                filaUser.setPosicao(posicao);
                filaUserRepository.save(filaUser);
            }

        } catch (EntityNotFoundException e) {
            throw e;
        }
    }

    @Transactional
    public F atualizarStatusUser(Long filaId, Long entityId, String status) {

        FilaUserValidator.validarParametrosAtualizarStatus(filaId, entityId, status);
        FilaUserValidator.validarStatusPermitido(status);

        Fila fila = filaRepository.findById(filaId).orElse(null);

        FilaUserValidator.verificarFilaExistente(fila, filaId);
        FilaUserValidator.verificarFilaAtiva(fila);

        // Buscar TODOS os registros do user na fila
        List<D> registrosUser = queueStrategy.findEntityByFilaIdAndEntityId(filaId, entityId);

        if (registrosUser.isEmpty()) {
            throw new EntityNotFoundException("User com ID " + entityId + " não está na fila com ID " + filaId);
        }

        D filaUser = obterRegistroAtivo(registrosUser)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Não há nenhum registro ativo do user na fila para atualizar status"));

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

        return mapToFilaUserDTO(filaUser);
    }

    public HistoricoUserAdminDTO historicoFilaUserId(Long userId) {

        E user = entityRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User não encontrado."));

        List<D> filas = filaUserRepository.findAllByUserId(userId);

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
                        filaUser.getDataEntrada()))
                .collect(Collectors.toList());

        T subject = createQueueSubject(user);

        return new HistoricoUserAdminDTO(subject.getNome(), historicoFilas);
    }

    protected Optional<D> obterRegistroAtivo(List<D> registrosUser) {
        return registrosUser.stream()
                .filter(fp -> !List.of("Atendido", "Atendido - Atrasado", "Removido").contains(fp.getStatus()))
                .max(Comparator.comparing(FilaUser::getDataEntrada));
    }

    protected void reorganizarFilaRestante(Long filaId, int posicaoRemovida) {
        List<D> filaRestante = filaUserRepository.findByFilaIdAndStatusOrderByPosicao(filaId, "Na fila");
        for (D fp : filaRestante) {
            if (fp.getPosicao() > posicaoRemovida) {
                fp.setPosicao(fp.getPosicao() - 1);
                filaUserRepository.save(fp);
            }
        }
    }

    protected void notificarProximoDaFila(Long filaId, int posicaoRemovida) {
        if (posicaoRemovida != 1) {
            return;
        }

        D novoProximo = filaUserRepository.findFirstByFilaIdAndStatusOrderByPosicao(filaId, "Na fila");
        if (novoProximo == null || Boolean.TRUE.equals(novoProximo.getNotificado())) {
            return;
        }

        try {
            String telefone = novoProximo.getUser().getTelefone();
            String primeiroNome = novoProximo.getUser().getNome().split(" ")[0];

            String sistema = getSystemName();

            String mensagem = String.format(
                    "👋 Olá %s! Aqui é da equipe *%s* 🏥\n\n"
                    + "Você é o *próximo da fila* para ser atendido! 🔔\n"
                    + "Fique atento e se prepare para o seu atendimento.\n\n"
                    + "Agradecemos pela sua paciência! 😊",
                    primeiroNome, sistema
            );

            whatsAppService.sendWhatsAppMessage(telefone, mensagem);
            novoProximo.setNotificado(true);
            filaUserRepository.save(novoProximo);
        } catch (Exception e) {
            System.err.println("Erro ao enviar WhatsApp: " + e.getMessage());
        }
    }

    protected void verificarSeUserPodeEntrarNaFila(Long userId) {
        List<D> registros = filaUserRepository.findAllByUserId(userId);

        boolean emFilaAtiva = registros.stream().anyMatch(fp -> fp.getFila().getAtivo()
                && !fp.getStatus().equals("Atendido")
                && !fp.getStatus().equals("Atendido - Atrasado"));

        if (emFilaAtiva) {
            throw new IllegalStateException("User já está em uma fila ativa e ainda não foi atendido.");
        }
    }

    protected void enviarMensagemBoasVindas(E entity, int posicao) {
        try {

            T subject = createQueueSubject(entity);

            String telefone = subject.getTelefone();
            String primeiroNome = subject.getNome().split(" ")[0];

            String sistema = getSystemName();

            String mensagem = String.format(

                    "👋 Olá %s! Aqui é da equipe *%s* 🏥\n\n"
                            + "Você entrou na fila com sucesso! 🎉\n"
                            + "Sua posição atual é: *%d*.\n"
                            + "Acompanhe seu status e fique atento para o seu atendimento.\n\n"
                            + "Agradecemos por utilizar o %s! 😊",
                    primeiroNome, sistema, posicao, sistema

            );

            whatsAppService.sendWhatsAppMessage(telefone, mensagem);
        } catch (Exception e) {
            System.err.println("Erro ao enviar mensagem de boas-vindas: " + e.getMessage());
        }
    }

    protected Long getFilaComEspecialidade(String especialidade) {
        return filaRepository.findByEspecialidadeAndAtivoTrue(especialidade)
                .orElseThrow(() -> new EntityNotFoundException("Não existe fila com essa especialidade"))
                .getId();
    }

    protected abstract F mapToFilaUserDTO(D filaUser);
    protected abstract String getSystemName();
    protected abstract T createQueueSubject(E entity);
}
