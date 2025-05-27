package com.medqueue.medqueue.controller.admin;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medqueue.medqueue.dto.ErrorResponse;
import com.medqueue.medqueue.service.admin.InsightsService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/insights")
@Tag(name = "Admin - Insights", description = "Obter informações sobre o sistema")
@RequiredArgsConstructor
public class InsigthsController {
    
    @Autowired
    private final InsightsService insightsService;


    @GetMapping("/tempo-medio-espera")
    @Operation(summary = "Obter o tempo médio de espera das filas ativas")
    public ResponseEntity<Map<String, Object>> obterTempoMedioEspera() {
        Map<String, Object> tempoMedio = insightsService.calcularTempoMedioEspera();
        return ResponseEntity.ok(tempoMedio);
    }

    @GetMapping("/tamanho-medio-filas")
    @Operation(summary = "Obter o tamanho médio das filas ativas")
    public ResponseEntity<Map<String, Object>> obterTamanhoMedioFilas() {
        Map<String, Object> tamanhoMedio = insightsService.calcularTamanhoMedioFilas();
        return ResponseEntity.ok(tamanhoMedio);
    }

    @GetMapping("/tempo-medio-por-especialidade")
    @Operation(summary = "Obter o tempo médio de espera por especialidade")
    public ResponseEntity<?> obterTempoMedioPorEspecialidade() {
        try {
            Map<String, Double> resultado = insightsService.calcularTempoMedioPorEspecialidade();
            return ResponseEntity.ok(resultado);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new ErrorResponse("Erro interno ao calcular tempo médio por especialidade."));
        }
    }
    
    @GetMapping("/pacientes-por-especialidade")
    @Operation(summary = "Obter quantidade de pacientes por especialidade")
    public ResponseEntity<?> obterPacientesPorEspecialidade() {
        try {
            Map<String, Integer> resultado = insightsService.calcularPacientesPorEspecialidade();
            return ResponseEntity.ok(resultado);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(new ErrorResponse("Erro interno ao calcular pacientes por especialidade."));
        }
    }


}
