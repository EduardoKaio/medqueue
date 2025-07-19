package com.queueflow.bankqueue.strategy;

/**
 * Strategy para diferentes tipos de notificação
 * Implementa o padrão Strategy para permitir diferentes formas de notificar clientes
 */
public interface NotificationStrategy {
    
    /**
     * Envia uma notificação para um cliente
     * @param telefone Telefone ou destinatário da notificação
     * @param mensagem Mensagem a ser enviada
     * @param nomeCliente Nome do cliente
     * @return true se a notificação foi enviada com sucesso, false caso contrário
     */
    boolean enviarNotificacao(String telefone, String mensagem, String nomeCliente);
    
    /**
     * Retorna o tipo de notificação desta strategy
     * @return Tipo da notificação (SMS, WHATSAPP, EMAIL)
     */
    String getTipoNotificacao();
}
