package com.medqueue.medqueue.service.paciente;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.medqueue.medqueue.dto.PrioridadeResponseDTO;
import com.medqueue.medqueue.dto.RecomendacaoResponseDTO;;

@Service
public class LLMService {
    private final ChatClient chatClient;

    public LLMService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public PrioridadeResponseDTO avaliarPrioridade(String sintomas) {
         if (sintomas == null || sintomas.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Sintomas não informados");
        }

        String prompt = "Considere a seguinte escala de prioridade médica: 1 = alta, 2 = intermediária, 3 = baixa. " +
                        "Com base nessa escala, qual é a prioridade de atendimento para um paciente com " + sintomas +
                        "? Responda apenas com o número da prioridade e uma breve justificativa.";

        String resposta = chatClient.prompt().user(prompt).call().content();

        int prioridade = extrairPrioridade(resposta);

        return new PrioridadeResponseDTO(prompt, resposta, prioridade);
    }

    private int extrairPrioridade(String resposta) {
        Pattern pattern = Pattern.compile("\\b(1|2|3)\\b");
        Matcher matcher = pattern.matcher(resposta);
        if (matcher.find()) {
            return Integer.parseInt(matcher.group(1));
        } else {
            // padrão de fallback, se o modelo não retornar algo esperado
            return -1;
        }
    }
    
    public RecomendacaoResponseDTO recomendarEspecialista(String sintomas) {
        if (sintomas == null || sintomas.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Sintomas não informados");
        }
        // Monta a pergunta com o sintoma informado
        String pergunta = """
            Considere os sintomas informados por um paciente. 
            Com base no sintoma descrito, diga qual especialista médico o paciente deve procurar. 
            Responda no seguinte formato, e dê apenas uma recomendação de especialista:
    
            Especialista: [Nome do especialista]
            Justificativa: [Explicação curta do motivo da recomendação]
    
            Sintoma: %s
        """.formatted(sintomas);
    
        // Chamada para a IA
        String resposta = chatClient.prompt()
                .user(pergunta)
                .call()
                .content();
    
        // Extrair campos da resposta
        String especialista = extrairEspecialista(resposta);
        String justificativa = extrairJustificativa(resposta);
    
        return new RecomendacaoResponseDTO(pergunta, resposta, especialista, justificativa);
    }
    

    // Simples parser usando regex ou substring
    private String extrairEspecialista(String resposta) {
        String prefixo = "Especialista:";
        if (resposta.contains(prefixo)) {
            String[] partes = resposta.split("Justificativa:");
            if (partes.length >= 1) {
                return partes[0].replace(prefixo, "").trim();
            }
        }
        return "Não identificado";
    }
    
    private String extrairJustificativa(String resposta) {
        String prefixo = "Justificativa:";
        if (resposta.contains(prefixo)) {
            return resposta.substring(resposta.indexOf(prefixo) + prefixo.length()).trim();
        }
        return "Não fornecida";
    }
    
}
