package com.medqueue.medqueue.service.admin;

import com.medqueue.medqueue.models.Fila;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InsightsService {

    private final FilaService filaService; // Dependência do FilaService para acessar as filas
    private final FilaPacienteService filaPacienteService; 

    public Map<String, Object> calcularTempoMedioEspera() {
        List<Fila> filasAtivas = filaService.listarAtivas(); // Lista de filas ativas

        Map<String, Object> resposta = new HashMap<>();
        
        if (filasAtivas.isEmpty()) {
            resposta.put("tempoMedioEsperaFilas", 0); // Retorna 0 se não houver filas ativas
        } else {
            // Soma os tempos médios das filas ativas
            double somaTempos = filasAtivas.stream()
                .mapToDouble(Fila::getTempoMedio)
                .sum();

            // Calcula a média
            double tempoMedio = somaTempos / filasAtivas.size();
            resposta.put("tempoMedioEsperaFilas", tempoMedio);
        }

        return resposta;
    }

    public Map<String, Object> calcularTamanhoMedioFilas() {
        List<Fila> filasAtivas = filaService.listarAtivas(); // Lista de filas ativas

        Map<String, Object> resposta = new HashMap<>();

        if (filasAtivas.isEmpty()) {
            resposta.put("tamanhoMedioFilas", 0); // Retorna 0 se não houver filas ativas
        } else {
            // Soma os tamanhos das filas ativas
            double somaTamanhos = filasAtivas.stream()
                .mapToInt(fila -> filaPacienteService.listarPacientes(fila.getId()).size()) // Conta os pacientes em cada fila ativa
                .sum();

            // Calcula a média
            double tamanhoMedio = somaTamanhos / filasAtivas.size();
            resposta.put("tamanhoMedioFilas", tamanhoMedio);
        }

        return resposta;
    }
}
