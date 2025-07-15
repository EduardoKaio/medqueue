package com.queueflow.medqueue.service;

import org.springframework.stereotype.Service;

import com.queueflow.medqueue.models.FilaPaciente;
import com.queueflow.medqueue.models.Paciente;
import com.queueflow.medqueue.repository.PacienteRepository;
import com.queueflow.queueflow.repository.FilaRepository;
import com.queueflow.queueflow.repository.FilaUserRepository;
import com.queueflow.queueflow.service.admin.AbstractFilaEntityService;
import com.queueflow.queueflow.service.user.WhatsAppService;
import com.queueflow.queueflow.strategy.QueueStrategy;

import com.queueflow.medqueue.adapters.PacienteAdapter;
import com.queueflow.medqueue.dto.FilaPacienteDTO;

@Service
public class FilaPacienteService extends AbstractFilaEntityService<Paciente, PacienteAdapter, FilaPacienteDTO, FilaPaciente> {

    public FilaPacienteService(
        QueueStrategy<PacienteAdapter, FilaPaciente> queueEntryStrategy, 
        FilaUserRepository<FilaPaciente> filaUserRepository,
        FilaRepository filaRepository,
        WhatsAppService whatsAppService,
        PacienteRepository pacienteRepository    
    ) {
        super(queueEntryStrategy, filaUserRepository, filaRepository, whatsAppService, pacienteRepository);
    }

    @Override
    protected FilaPacienteDTO mapToFilaUserDTO(FilaPaciente filaUser) {

        return new FilaPacienteDTO(
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

    @Override
    protected PacienteAdapter createQueueSubject(Paciente paciente) {
        // A lógica para criar o Adapter a partir da Entidade
        return new PacienteAdapter(paciente);
    }
}
