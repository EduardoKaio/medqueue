package com.medqueue.medqueue.dto.admin;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PacienteDTO {

    private Long id;

    private String nome;

    private String cpf;

    private LocalDate dataNascimento;

    private String sexo;

    private String email;

    private String telefone;

    private String endereco;
}
