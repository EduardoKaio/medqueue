package com.queueflow.bankqueue.service;

import com.queueflow.bankqueue.strategy.SmsNotificationStrategy;
import org.springframework.stereotype.Service;

@Service
public class SmsNotificationService {
    private final SmsNotificationStrategy smsStrategy;
    
    public SmsNotificationService(SmsNotificationStrategy smsStrategy) {
        this.smsStrategy = smsStrategy;
    }
    
    public boolean enviarSmsProximoAtendimento(String telefone, String nomeCliente, String nomeFila) {
        String mensagem = String.format("Ola %s! Voce e o proximo na fila %s. Dirija-se ao atendimento!", nomeCliente, nomeFila);
        return smsStrategy.enviarNotificacao(telefone, mensagem, nomeCliente);
    }
    
    public boolean enviarSmsAtendimentoConcluido(String telefone, String nomeCliente, String nomeFila) {
        String mensagem = String.format("Ola %s! Seu atendimento na fila %s foi concluido. Obrigado pela preferencia!", nomeCliente, nomeFila);
        return smsStrategy.enviarNotificacao(telefone, mensagem, nomeCliente);
    }
    
    public boolean enviarSmsRemovidoDaFila(String telefone, String nomeCliente, String nomeFila, String motivo) {
        String mensagem = String.format("Ola %s! Voce foi removido da fila %s. Motivo: %s", nomeCliente, nomeFila, motivo);
        return smsStrategy.enviarNotificacao(telefone, mensagem, nomeCliente);
    }
    
    public boolean enviarNotificacao(String telefone, String mensagem, String nomeCliente) {
        return smsStrategy.enviarNotificacao(telefone, mensagem, nomeCliente);
    }
    
    public String getTipoNotificacaoAtual() {
        return "SMS";
    }
}