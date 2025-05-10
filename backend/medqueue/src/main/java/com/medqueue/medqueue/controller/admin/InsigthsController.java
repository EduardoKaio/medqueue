package com.medqueue.medqueue.controller.admin;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
