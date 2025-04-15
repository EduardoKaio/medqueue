package com.medqueue.medqueue.controller.admin;

import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.handler.annotation.support.MethodArgumentNotValidException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import com.medqueue.medqueue.dto.PrioridadeResponseDTO;
import com.medqueue.medqueue.dto.RecomendacaoResponseDTO;
import com.medqueue.medqueue.dto.SintomasRequestDTO;
import com.medqueue.medqueue.service.admin.ChatService;

import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin/chatbot")
public class ChatController {

    private final ChatService chatService;

    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/avaliar-prioridade")
    public PrioridadeResponseDTO avaliarPrioridade(@RequestBody SintomasRequestDTO request) {
        return chatService.avaliarPrioridade(request.getSintomas());
    }

    @PostMapping("/recomendar-especialista")
    public RecomendacaoResponseDTO recomendarEspecialista(@RequestBody SintomasRequestDTO request) {
        return chatService.recomendarEspecialista(request.getSintomas());
    }

}
