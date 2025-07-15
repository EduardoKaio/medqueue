package com.queueflow.bankqueue.service;

import com.queueflow.bankqueue.dto.FilaClienteDTO;
import com.queueflow.bankqueue.models.Cliente;
import com.queueflow.bankqueue.models.FilaCliente;
import com.queueflow.bankqueue.repository.FilaClienteRepository;
import com.queueflow.queueflow.service.admin.AbstractFilaEntityService;
import com.queueflow.queueflow.strategy.QueueStrategy;
import com.queueflow.queueflow.repository.FilaRepository;
import com.queueflow.queueflow.repository.EntityRepository;
import com.queueflow.queueflow.service.user.WhatsAppService;
import org.springframework.stereotype.Service;

@Service
public class FilaEntityService extends AbstractFilaEntityService<Cliente, Cliente, FilaClienteDTO, FilaCliente> {
    
    public FilaEntityService(
        QueueStrategy<Cliente, FilaCliente> queueStrategy,
        FilaClienteRepository filaUserRepository,
        FilaRepository filaRepository,
        WhatsAppService whatsAppService,
        EntityRepository<Cliente> entityRepository
    ) {
        super(queueStrategy, filaUserRepository, filaRepository, whatsAppService, entityRepository);
    }

    @Override
    protected FilaClienteDTO mapToFilaUserDTO(FilaCliente filaUser) {
        return new FilaClienteDTO(
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
    
    @Override
    protected Cliente createQueueSubject(Cliente entity) {
        return entity; // Cliente já implementa QueueSubject através de User
    }
}
