package com.queueflow.bankqueue.service;

import com.queueflow.queueflow.dto.FilaUserDTO;
import com.queueflow.queueflow.models.FilaUser;
import com.queueflow.bankqueue.models.Cliente;
import com.queueflow.queueflow.service.admin.AbstractFilaEntityService;
import com.queueflow.queueflow.strategy.QueueStrategy;
import com.queueflow.queueflow.repository.FilaUserRepository;
import com.queueflow.queueflow.repository.FilaRepository;
import com.queueflow.queueflow.repository.EntityRepository;
import com.queueflow.queueflow.service.user.WhatsAppService;
import org.springframework.stereotype.Service;

@Service
public class FilaEntityService extends AbstractFilaEntityService<Cliente> {
    public FilaEntityService(
        QueueStrategy<Cliente> queueEntryStrategy,
        FilaUserRepository filaUserRepository,
        FilaRepository filaRepository,
        EntityRepository<Cliente> entityRepository,
        WhatsAppService whatsAppService
    ) {
        super(queueEntryStrategy, filaUserRepository, filaRepository, entityRepository, whatsAppService);
    }

    @Override
    protected FilaUserDTO mapToFilaUserDTO(FilaUser filaUser) {
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

    @Override
    protected String getSystemName() {
        return "BankQueue";
    }
}
