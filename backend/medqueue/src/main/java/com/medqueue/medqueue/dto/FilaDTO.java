package com.medqueue.medqueue.dto;

import java.time.LocalDate;

import javax.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FilaDTO {
    private Long id;
    private String nome;
    private String descricao;
    private Boolean ativo;
    @Min(value = 0, message = "Tempo médio deve ser maior ou igual a zero")
    private Double tempoMedio;

    private LocalDate dataCriacao;
}
