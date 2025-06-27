package com.queueflow.queueflow.controller.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.queueflow.queueflow.dto.WhatsAppRequestDTO;
import com.queueflow.queueflow.service.user.WhatsAppService;

@RestController
@RequestMapping("/api/whatsapp")
public class WhatsAppController {

    private final WhatsAppService whatsAppService;

    public WhatsAppController(WhatsAppService whatsAppService) {
        this.whatsAppService = whatsAppService;
    }

    @PostMapping("/send-message")
    public ResponseEntity<?> sendMessage(@RequestBody WhatsAppRequestDTO request) {
        try {
            whatsAppService.sendWhatsAppMessage(request.getTo(), request.getMessage());
            return ResponseEntity.ok("Mensagem enviada para " + request.getTo());
        } catch (Exception e) {
            // Retorna um JSON simples com a mensagem de erro
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                "{\"error\": \"" + e.getMessage() + "\"}"
            );
        }
    }
}
