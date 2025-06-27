// package com.queueflow.queueflow.controller.user;

// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;
// import com.queueflow.queueflow.dto.PrioridadeResponseDTO;
// import com.queueflow.queueflow.dto.RecomendacaoResponseDTO;
// import com.queueflow.queueflow.dto.SintomasRequestDTO;
// import com.queueflow.queueflow.service.user.LLMService;
// import org.springframework.web.bind.annotation.RequestBody;

// import java.util.Map;

// @RestController
// @RequestMapping("/api/user/triagem")
// public class LLMController {

//     private final LLMService llmService;

//     public LLMController(LLMService llmService) {
//         this.llmService = llmService;
//     }

//     @PostMapping("/avaliar-prioridade")
//     public ResponseEntity<?> avaliarPrioridade(@RequestBody SintomasRequestDTO request) {
//         try {
//             // Chama o serviço para avaliar a prioridade
//             PrioridadeResponseDTO resposta = llmService.avaliarPrioridade(request.getSintomas());
//             return ResponseEntity.ok(resposta);
//         } catch (org.springframework.web.server.ResponseStatusException e) {
//             // Captura a exceção do serviço (ex: Sintomas não informados)
//             return ResponseEntity.status(e.getStatusCode()).body(Map.of("erro", e.getReason()));
//         } catch (Exception e) {
//             // Captura outras exceções gerais
//             return ResponseEntity.status(500).body(Map.of("erro", "Erro ao processar a avaliação de prioridade: " + e.getMessage()));
//         }
//     }

//     @PostMapping("/recomendar-especialista")
//     public ResponseEntity<?> recomendarEspecialista(@RequestBody SintomasRequestDTO request) {
//         try {
//             // Chama o serviço para recomendar o especialista
//             RecomendacaoResponseDTO resposta = llmService.recomendarEspecialista(request.getSintomas());
//             return ResponseEntity.ok(resposta);
//         } catch (org.springframework.web.server.ResponseStatusException e) {
//             // Captura a exceção do serviço (ex: Sintomas não informados)
//             return ResponseEntity.status(e.getStatusCode()).body(Map.of("erro", e.getReason()));
//         } catch (Exception e) {
//             // Captura outras exceções gerais
//             return ResponseEntity.status(500).body(Map.of("erro", "Erro ao recomendar especialista: " + e.getMessage()));
//         }
//     }
// }
