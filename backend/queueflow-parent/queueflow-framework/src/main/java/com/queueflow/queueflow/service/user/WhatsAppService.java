package com.queueflow.queueflow.service.user;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@Service
public class WhatsAppService {

    private final RestTemplate restTemplate;

    public WhatsAppService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void sendWhatsAppMessage(String toBody, String messageBody) throws Exception {
        // Validações
        if (toBody == null || toBody.trim().isEmpty()) {
            throw new Exception("Número de telefone é obrigatório.");
        }
        if (messageBody == null || messageBody.trim().isEmpty()) {
            throw new Exception("Mensagem não pode ser vazia.");
        }
        if (!isValidPhoneNumber(toBody)) {
            throw new Exception("Número de telefone inválido.");
        }

        String venomServerUrl = "http://localhost:3000/send-message"; // URL do serviço Venom
        // String venomServerUrl = "http://venom-server:3000/send-message"; // Usando o nome do serviço do Docker


        JSONObject body = new JSONObject();
        body.put("to", toBody);
        body.put("message", messageBody);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(body.toString(), headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(venomServerUrl, request, String.class);

            if (response.getStatusCode() != HttpStatus.OK) {
                throw new Exception("Erro ao enviar via Venom: " + response.getBody());
            }
        } catch (Exception e) {
            throw new Exception("Erro ao conectar com o servidor Venom: " + e.getMessage());
        }
    }

    // Função para validar o número de telefone
    private boolean isValidPhoneNumber(String phoneNumber) {
        // Expressão regular para verificar se o número tem 13 ou 14 dígitos
        return phoneNumber.matches("\\d{13,14}");
    }
}
