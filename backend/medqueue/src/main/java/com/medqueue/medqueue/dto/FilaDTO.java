package com.medqueue.medqueue.dto;

import java.time.LocalDate;

import javax.validation.constraints.Min;
import groovy.transform.builder.Builder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FilaDTO {
    private Long id;
    private String nome;
    private String descricao;
    private Boolean ativo;
    @Min(value = 0, message = "Prioridade deve ser maior ou igual a zero")
    private Integer prioridade;
    @Min(value = 0, message = "Tempo médio deve ser maior ou igual a zero")
    private Double tempoMedio;
    private LocalDate dataCriacao;
}
