package com.queueflow.bankqueue.service;

import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
public class SmsNotificationService {

    private final List<SmsNotification> notificationsHistory = new ArrayList<>();
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    public static class SmsNotification {
        private String telefone;
        private String mensagem;
        private LocalDateTime dataEnvio;
        private String status;
        private String tipo;

        public SmsNotification(String telefone, String mensagem, String tipo) {
            this.telefone = telefone;
            this.mensagem = mensagem;
            this.dataEnvio = LocalDateTime.now();
            this.status = "ENVIADO";
            this.tipo = tipo;
        }

        // Getters
        public String getTelefone() { return telefone; }
        public String getMensagem() { return mensagem; }
        public LocalDateTime getDataEnvio() { return dataEnvio; }
        public String getStatus() { return status; }
        public String getTipo() { return tipo; }
    }

    public CompletableFuture<Boolean> enviarSmsEntradaNaFila(String telefone, String nomeCliente, String tipoFila, int posicao) {
        return CompletableFuture.supplyAsync(() -> {
            String mensagem = String.format(
                "🏦 BankQueue - Olá %s! Você foi adicionado à fila %s na posição %d. " +
                "Acompanhe sua posição pelo app. Tempo estimado: %d min.",
                nomeCliente, tipoFila, posicao, posicao * 5
            );
            
            return enviarSms(telefone, mensagem, "ENTRADA_FILA");
        });
    }

    public CompletableFuture<Boolean> enviarSmsProximoAtendimento(String telefone, String nomeCliente, String tipoFila) {
        return CompletableFuture.supplyAsync(() -> {
            String mensagem = String.format(
                "🔔 BankQueue - %s, você é o próximo! Dirija-se ao %s. " +
                "Não perca sua vez!",
                nomeCliente, tipoFila
            );
            
            return enviarSms(telefone, mensagem, "PROXIMO_ATENDIMENTO");
        });
    }

    public CompletableFuture<Boolean> enviarSmsCheckIn(String telefone, String nomeCliente, String tipoFila) {
        return CompletableFuture.supplyAsync(() -> {
            String mensagem = String.format(
                "✅ BankQueue - %s, seu atendimento no %s foi iniciado. " +
                "Obrigado por aguardar!",
                nomeCliente, tipoFila
            );
            
            return enviarSms(telefone, mensagem, "CHECK_IN");
        });
    }

    public CompletableFuture<Boolean> enviarSmsAtendimentoConcluido(String telefone, String nomeCliente, String tipoFila) {
        return CompletableFuture.supplyAsync(() -> {
            String mensagem = String.format(
                "🎉 BankQueue - %s, seu atendimento no %s foi concluído! " +
                "Obrigado por usar nossos serviços. Avalie nossa experiência no app.",
                nomeCliente, tipoFila
            );
            
            return enviarSms(telefone, mensagem, "ATENDIMENTO_CONCLUIDO");
        });
    }

    public CompletableFuture<Boolean> enviarSmsAlertaAtraso(String telefone, String nomeCliente, String tipoFila) {
        return CompletableFuture.supplyAsync(() -> {
            String mensagem = String.format(
                "⚠️ BankQueue - %s, você tem 2 minutos para se apresentar no %s " +
                "ou será removido da fila automaticamente.",
                nomeCliente, tipoFila
            );
            
            return enviarSms(telefone, mensagem, "ALERTA_ATRASO");
        });
    }

    public CompletableFuture<Boolean> enviarSmsRemovidoDaFila(String telefone, String nomeCliente, String tipoFila, String motivo) {
        return CompletableFuture.supplyAsync(() -> {
            String mensagem = String.format(
                "❌ BankQueue - %s, você foi removido da fila %s. Motivo: %s. " +
                "Para nova solicitação, use o app novamente.",
                nomeCliente, tipoFila, motivo
            );
            
            return enviarSms(telefone, mensagem, "REMOVIDO_FILA");
        });
    }

    private boolean enviarSms(String telefone, String mensagem, String tipo) {
        try {
            // Simula delay de envio de SMS
            Thread.sleep(500);
            
            // Log colorido para facilitar visualização
            log.info("📱 SMS ENVIADO:");
            log.info("  📞 Telefone: {}", telefone);
            log.info("  💬 Mensagem: {}", mensagem);
            log.info("  🏷️ Tipo: {}", tipo);
            log.info("  🕒 Horário: {}", LocalDateTime.now().format(formatter));
            log.info("  ✅ Status: ENVIADO");
            log.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            
            // Salva no histórico
            SmsNotification notification = new SmsNotification(telefone, mensagem, tipo);
            notificationsHistory.add(notification);
            
            return true;
        } catch (Exception e) {
            log.error("❌ Erro ao enviar SMS para {}: {}", telefone, e.getMessage());
            return false;
        }
    }

    public List<SmsNotification> getHistoricoNotificacoes() {
        return new ArrayList<>(notificationsHistory);
    }

    public List<SmsNotification> getNotificacoesPorTelefone(String telefone) {
        return notificationsHistory.stream()
                .filter(n -> n.getTelefone().equals(telefone))
                .toList();
    }

    public long getContadorNotificacoes() {
        return notificationsHistory.size();
    }
}
