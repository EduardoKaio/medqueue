package com.queueflow.bankqueue.controller;

import com.queueflow.bankqueue.service.FilaEntityService;
import com.queueflow.bankqueue.service.SmsNotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sms")
@RequiredArgsConstructor
@Tag(name = "SMS Notifications", description = "Endpoints para notificações SMS do BankQueue")
public class SmsController {

    private final SmsNotificationService smsNotificationService;
    private final FilaEntityService filaEntityService;

    @PostMapping("/notificar-proximo/{filaId}/{userId}")
    @Operation(
        summary = "Notificar próximo da fila",
        description = "Envia SMS para notificar que o cliente é o próximo a ser atendido"
    )
    public ResponseEntity<Map<String, Object>> notificarProximoAtendimento(
            @Parameter(description = "ID da fila") @PathVariable Long filaId,
            @Parameter(description = "ID do usuário") @PathVariable Long userId) {
        try {
            filaEntityService.notificarProximoAtendimento(filaId, userId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Notificação enviada com sucesso!"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Erro ao enviar notificação: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/historico")
    @Operation(
        summary = "Histórico de SMS",
        description = "Retorna o histórico de todas as notificações SMS enviadas"
    )
    public ResponseEntity<List<SmsNotificationService.SmsNotification>> getHistoricoNotificacoes() {
        List<SmsNotificationService.SmsNotification> historico = smsNotificationService.getHistoricoNotificacoes();
        return ResponseEntity.ok(historico);
    }

    @GetMapping("/historico/{telefone}")
    @Operation(
        summary = "Histórico de SMS por telefone",
        description = "Retorna o histórico de notificações SMS para um telefone específico"
    )
    public ResponseEntity<List<SmsNotificationService.SmsNotification>> getNotificacoesPorTelefone(
            @Parameter(description = "Número do telefone") @PathVariable String telefone) {
        List<SmsNotificationService.SmsNotification> notificacoes = 
            smsNotificationService.getNotificacoesPorTelefone(telefone);
        return ResponseEntity.ok(notificacoes);
    }

    @GetMapping("/contador")
    @Operation(
        summary = "Contador de SMS",
        description = "Retorna o número total de SMS enviados"
    )
    public ResponseEntity<Map<String, Object>> getContadorNotificacoes() {
        long contador = smsNotificationService.getContadorNotificacoes();
        return ResponseEntity.ok(Map.of(
            "totalSmsEnviados", contador,
            "sistema", "BankQueue SMS Service"
        ));
    }

    @PostMapping("/teste/{telefone}")
    @Operation(
        summary = "Enviar SMS de teste",
        description = "Envia um SMS de teste para verificar a funcionalidade"
    )
    public ResponseEntity<Map<String, Object>> enviarSMSTeste(
            @Parameter(description = "Número do telefone") @PathVariable String telefone,
            @Parameter(description = "Nome do cliente") @RequestParam(defaultValue = "Cliente Teste") String nome) {
        try {
            boolean enviado = smsNotificationService.enviarSmsEntradaNaFila(
                telefone, nome, "Atendimento Geral", 1
            ).get();
            
            return ResponseEntity.ok(Map.of(
                "success", enviado,
                "message", enviado ? "SMS de teste enviado com sucesso!" : "Falha ao enviar SMS de teste",
                "telefone", telefone,
                "nome", nome
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Erro ao enviar SMS de teste: " + e.getMessage()
            ));
        }
    }
}
