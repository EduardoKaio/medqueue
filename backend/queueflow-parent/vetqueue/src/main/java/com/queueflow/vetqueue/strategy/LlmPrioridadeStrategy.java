package com.queueflow.vetqueue.strategy;

import com.queueflow.queueflow.dto.PrioridadeRequestDTO;
import com.queueflow.queueflow.strategy.PrioridadeStrategy;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Component;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class LlmPrioridadeStrategy implements PrioridadeStrategy {

    private final ChatClient chatClient;

    public LlmPrioridadeStrategy(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    private String ultimoEspecialista = "Não identificado";
    private String justificativaPrioridade = "Não fornecida";
    private String justificativaEspecialista = "Não fornecida";

    @Override
    public int calcularPrioridade(PrioridadeRequestDTO dados) {
        String sintomas = dados.getSintomas();

        if (sintomas == null || sintomas.isBlank()) {
            ultimoEspecialista = "Não identificado";
            justificativaPrioridade = "Sintomas não informados";
            justificativaEspecialista = "Sintomas não informados";
            return 3;
        }

        String prompt = """
            Considere a seguinte escala de prioridade veterinária:
            1 = alta, 2 = intermediária, 3 = baixa.

            Com base nessa escala, avalie a prioridade de atendimento para um animal com os seguintes sintomas: %s

            Além disso, recomende **somente UM único especialista veterinário** mais indicado para esse caso (ex: clínico geral, dermatologista veterinário, ortopedista veterinário, etc). Não liste mais de um especialista.

            Responda no seguinte formato exato e sem informações adicionais:

            Prioridade: [1|2|3]
            Justificativa da prioridade: [explicação curta]
            Especialista: [Nome do especialista veterinário único]
            Justificativa do especialista: [explicação curta]
            """.formatted(sintomas);


        String resposta = chatClient.prompt().user(prompt).call().content();

        ultimoEspecialista = extrairCampoString(resposta, "Especialista", "Não identificado");
        justificativaPrioridade = extrairCampoString(resposta, "Justificativa da prioridade", "Não fornecida");
        justificativaEspecialista = extrairCampoString(resposta, "Justificativa do especialista", "Não fornecida");

        return extrairCampoInt(resposta, "Prioridade", 3);
    }

    public String getUltimoEspecialista() {
        return ultimoEspecialista;
    }

    public String getJustificativaPrioridade() {
        return justificativaPrioridade;
    }

    public String getJustificativaEspecialista() {
        return justificativaEspecialista;
    }

    private int extrairCampoInt(String texto, String campo, int defaultValue) {
        Pattern pattern = Pattern.compile(campo + ":\\s*(\\d+)");
        Matcher matcher = pattern.matcher(texto);
        return matcher.find() ? Integer.parseInt(matcher.group(1)) : defaultValue;
    }

    private String extrairCampoString(String texto, String campo, String defaultValue) {
        Pattern pattern = Pattern.compile(campo + ":\\s*(.+)");
        Matcher matcher = pattern.matcher(texto);
        return matcher.find() ? matcher.group(1).trim() : defaultValue;
    }
}