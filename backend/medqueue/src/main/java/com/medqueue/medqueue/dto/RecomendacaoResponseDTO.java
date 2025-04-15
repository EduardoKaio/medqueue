package com.medqueue.medqueue.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RecomendacaoResponseDTO {
    private String prompt;
    private String resposta_completa;
    private String recomendacao_especialista;
    private String justificativa;
}
