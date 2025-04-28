package com.medqueue.medqueue.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PacienteDTO {

    private Long id;

    private String nome;

    private String cpf;

    private String senha;

    private LocalDate dataNascimento;

    private String sexo;

    private String email;

    private String telefone;

    private String endereco;

    private String role;
}
