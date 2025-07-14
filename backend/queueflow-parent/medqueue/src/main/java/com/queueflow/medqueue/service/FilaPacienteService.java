package com.queueflow.medqueue.service;

import org.springframework.stereotype.Service;

import com.queueflow.medqueue.models.Paciente;
import com.queueflow.queueflow.dto.FilaUserDTO;
import com.queueflow.queueflow.models.FilaUser;
import com.queueflow.queueflow.repository.EntityRepository;
import com.queueflow.queueflow.repository.FilaRepository;
import com.queueflow.queueflow.repository.FilaUserRepository;
import com.queueflow.queueflow.service.admin.AbstractFilaEntityService;
import com.queueflow.queueflow.service.user.WhatsAppService;
import com.queueflow.queueflow.strategy.QueueStrategy;

@Service
public class FilaPacienteService extends AbstractFilaEntityService<Paciente> {

    public FilaPacienteService(QueueStrategy<Paciente> queueEntryStrategy, FilaUserRepository filaUserRepository,
            FilaRepository filaRepository, EntityRepository<Paciente> entityRepository,
            WhatsAppService whatsAppService) {
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
        return "Medqueue";
    }

}
