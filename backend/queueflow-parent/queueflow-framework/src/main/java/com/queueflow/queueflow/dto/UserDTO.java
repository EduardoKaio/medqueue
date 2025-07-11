package com.queueflow.queueflow.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class UserDTO {

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
    private Boolean ativo;

    private String tipoConta; 
}
