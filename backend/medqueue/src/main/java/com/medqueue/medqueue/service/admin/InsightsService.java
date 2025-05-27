package com.medqueue.medqueue.service.admin;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.medqueue.medqueue.models.Fila;

import lombok.RequiredArgsConstructor;

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

    public Map<String, Double> calcularTempoMedioPorEspecialidade() {
        List<Fila> filasAtivas = filaService.listarAtivas();

        if (filasAtivas.isEmpty()) {
            throw new IllegalStateException("Não há filas ativas para calcular o tempo médio por especialidade.");
        }

        // Agrupa por especialidade e calcula a média
        Map<String, Double> mediaPorEspecialidade = filasAtivas.stream()
                .collect(
                        java.util.stream.Collectors.groupingBy(
                                Fila::getEspecialidade,
                                java.util.stream.Collectors.averagingDouble(Fila::getTempoMedio)
                        )
                );

        // Cria novo mapa com nomes ajustados
        Map<String, Double> resultadoFinal = new HashMap<>();
        for (Map.Entry<String, Double> entry : mediaPorEspecialidade.entrySet()) {
            String especialidade = entry.getKey();
            Double media = entry.getValue();

            if (especialidade.equalsIgnoreCase("geral")) {
                resultadoFinal.put("Clínico Geral", media);
            } else {
                resultadoFinal.put(especialidade, media);
            }
        }

        return resultadoFinal;
    }

    public Map<String, Integer> calcularPacientesPorEspecialidade() {
        List<Fila> filasAtivas = filaService.listarAtivas();

        if (filasAtivas.isEmpty()) {
            throw new IllegalStateException("Não há filas ativas para contar pacientes por especialidade.");
        }

        Map<String, Integer> pacientesPorEspecialidade = new HashMap<>();

        for (Fila fila : filasAtivas) {
            String especialidade = fila.getEspecialidade();
            if (especialidade.equalsIgnoreCase("geral")) {
                especialidade = "Clínico Geral";
            }

            int quantidade = filaPacienteService.listarPacientes(fila.getId()).size();
            pacientesPorEspecialidade.merge(especialidade, quantidade, Integer::sum);
        }

        return pacientesPorEspecialidade;
    }

}
