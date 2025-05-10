package com.medqueue.medqueue.dto;

import java.time.LocalDate;

<<<<<<< Updated upstream
import groovy.transform.builder.Builder;
=======
import javax.validation.constraints.Min;
>>>>>>> Stashed changes
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class FilaDTO {
    private Long id;
<<<<<<< Updated upstream
    private LocalDate data_criaca;
=======
    private String nome;
    private String descricao;
    private Boolean ativo;
    @Min(value = 0, message = "Tempo médio deve ser maior ou igual a zero")
    private Double tempoMedio;
    private LocalDate dataCriacao;
>>>>>>> Stashed changes
}
