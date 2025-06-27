// no queueflow-framework/dto/UserCreationDTO.java (crie o pacote dto)
package com.queueflow.queueflow.dto;

import com.queueflow.queueflow.models.User;
import lombok.Data;
import java.time.LocalDate;

@Data
public class UserCreationDTO {
    private String nome;
    private String cpf;
    private String senha; // Você precisará criptografar isso antes de salvar
    private LocalDate dataNascimento;
    private User.Sexo sexo;
    private String email;
    private String telefone;
    private String endereco;
    private User.Role role = User.Role.ROLE_USER; // Padrão para ROLE_USER
}