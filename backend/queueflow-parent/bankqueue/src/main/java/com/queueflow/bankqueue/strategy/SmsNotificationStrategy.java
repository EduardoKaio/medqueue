package com.queueflow.bankqueue.strategy;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.json.JSONObject;

/**
 * Implementação da Strategy para notificações via SMS
 * Utiliza o serviço Venom para envio de mensagens SMS
 */
@Component
public class SmsNotificationStrategy implements NotificationStrategy {

    @Value("${venom.server.url:http://localhost:3000}")
    private String venomServerUrl;

    private final RestTemplate restTemplate;

    public SmsNotificationStrategy(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public boolean enviarNotificacao(String telefone, String mensagem, String nomeCliente) {
        try {
            System.out.println("📱 Enviando SMS para " + nomeCliente + " (" + telefone + "): " + mensagem);
            
            // Validações
            if (telefone == null || telefone.trim().isEmpty()) {
                System.err.println("Número de telefone é obrigatório para envio de SMS");
                return false;
            }
            
            if (mensagem == null || mensagem.trim().isEmpty()) {
                System.err.println("Mensagem não pode ser vazia para envio de SMS");
                return false;
            }

            String url = venomServerUrl + "/send-message";
            
            JSONObject body = new JSONObject();
            body.put("to", telefone);
            body.put("message", mensagem);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> request = new HttpEntity<>(body.toString(), headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                System.out.println("✅ SMS enviado com sucesso para " + nomeCliente + " (" + telefone + ")");
                return true;
            } else {
                System.err.println("❌ Erro ao enviar SMS: " + response.getBody());
                return false;
            }
            
        } catch (Exception e) {
            System.err.println("❌ Erro ao enviar SMS para " + nomeCliente + " (" + telefone + "): " + e.getMessage());
            return false;
        }
    }

    @Override
    public String getTipoNotificacao() {
        return "SMS";
    }
}
