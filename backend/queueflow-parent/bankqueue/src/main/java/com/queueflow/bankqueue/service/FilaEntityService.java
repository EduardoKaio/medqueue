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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FilaEntityService extends AbstractFilaEntityService<Cliente, Cliente, FilaClienteDTO, FilaCliente> {
    
    @Autowired
    private SmsNotificationService smsNotificationService;
    
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

    @Override
    public FilaClienteDTO atualizarStatusUser(Long filaId, Long userId, String novoStatus) {
        var filaClienteOpt = filaUserRepository.findByUserIdAndFilaId(userId, filaId);
        
        FilaClienteDTO resultado = super.atualizarStatusUser(filaId, userId, novoStatus);
        
        // Enviar SMS baseado na mudança de status
        if (!filaClienteOpt.isEmpty()) {
            FilaCliente filaCliente = filaClienteOpt.get(0);
            Cliente cliente = (Cliente) filaCliente.getUser();
            var fila = filaRepository.findById(filaId).orElse(null);
            
            if (fila != null && cliente.getTelefone() != null) {
                if (novoStatus.contains("Atendido")) {
                    smsNotificationService.enviarSmsAtendimentoConcluido(
                        cliente.getTelefone(),
                        cliente.getNome(),
                        fila.getEspecialidade()
                    );
                } else if (novoStatus.equals("Atrasado")) {
                    smsNotificationService.enviarSmsRemovidoDaFila(
                        cliente.getTelefone(),
                        cliente.getNome(),
                        fila.getEspecialidade(),
                        "Tempo limite excedido"
                    );
                } else if (novoStatus.equals("Removido")) {
                    smsNotificationService.enviarSmsRemovidoDaFila(
                        cliente.getTelefone(),
                        cliente.getNome(),
                        fila.getEspecialidade(),
                        "Removido pelo administrador"
                    );
                }
            }
        }
        
        return resultado;
    }

    // Método para notificar próximo da fila - usado pelo frontend
    public void notificarProximoAtendimento(Long filaId, Long userId) {
        var filaClienteOpt = filaUserRepository.findByUserIdAndFilaId(userId, filaId);
        if (!filaClienteOpt.isEmpty()) {
            FilaCliente filaCliente = filaClienteOpt.get(0);
            Cliente cliente = (Cliente) filaCliente.getUser();
            var fila = filaRepository.findById(filaId).orElse(null);
            
            if (fila != null && cliente.getTelefone() != null) {
                smsNotificationService.enviarSmsProximoAtendimento(
                    cliente.getTelefone(),
                    cliente.getNome(),
                    fila.getEspecialidade()
                );
            }
        }
    }
}
