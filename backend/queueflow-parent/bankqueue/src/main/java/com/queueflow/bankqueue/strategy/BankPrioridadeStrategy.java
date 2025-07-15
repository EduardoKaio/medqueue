package com.queueflow.bankqueue.strategy;

import com.queueflow.queueflow.dto.PrioridadeRequestDTO;
import com.queueflow.queueflow.strategy.PrioridadeStrategy;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Component;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class BankPrioridadeStrategy implements PrioridadeStrategy {

    private final ChatClient chatClient;

    public BankPrioridadeStrategy(ChatClient.Builder builder) {
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
            Considere a seguinte escala de prioridade bancária:
            1 = alta, 2 = intermediária, 3 = baixa.

            Com base nessa escala, avalie a prioridade de atendimento para um cliente de banco com a seguinte solicitação: %s

            Além disso, recomende apenas UM setor ou serviço bancário mais indicado para esse caso (ex: caixa eletrônico, guichê de atendimento, gerente de conta). Não use 'ou', não liste múltiplos setores, indique apenas UM nome de setor/serviço.

            Responda no seguinte formato:

            Prioridade: [1|2|3]
            Justificativa da prioridade: [explicação curta]
            Setor: [Nome do setor ou serviço]
            Justificativa do setor: [explicação curta]
            """.formatted(sintomas);

        String resposta = chatClient.prompt().user(prompt).call().content();


        // Para manter compatibilidade com o frontend, os campos abaixo são preenchidos conforme esperado
        ultimoEspecialista = extrairCampoString(resposta, "Setor", "Não identificado");
        justificativaPrioridade = extrairCampoString(resposta, "Justificativa da prioridade", "Não fornecida");
        justificativaEspecialista = extrairCampoString(resposta, "Justificativa do setor", "Não fornecida");

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