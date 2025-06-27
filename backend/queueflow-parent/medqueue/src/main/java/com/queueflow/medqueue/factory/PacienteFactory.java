package com.queueflow.medqueue.factory;

import com.queueflow.queueflow.models.User;
import com.queueflow.queueflow.dto.UserDTO;
import com.queueflow.queueflow.factory.UserFactory;
import com.queueflow.medqueue.models.Paciente;
import org.springframework.stereotype.Component;

@Component
public class PacienteFactory implements UserFactory {

    @Override
    public UserDTO toDTO(User user) {
        Paciente paciente = (Paciente) user;
        UserDTO dto = new UserDTO();
        dto.setId(paciente.getId());
        dto.setNome(paciente.getNome());
        dto.setCpf(paciente.getCpf());
        dto.setSenha(paciente.getSenha());
        dto.setDataNascimento(paciente.getDataNascimento());

        // Convertendo enums para String no DTO
        dto.setSexo(paciente.getSexo() != null ? paciente.getSexo().name() : null);
        dto.setEmail(paciente.getEmail());
        dto.setTelefone(paciente.getTelefone());
        dto.setEndereco(paciente.getEndereco());

        // Atributo boolean ativo
        dto.setAtivo(paciente.getAtivo());  // paciente deve ter isAtivo()
        dto.setRole(paciente.getRole() != null ? paciente.getRole().name() : null);

        return dto;
    }

    @Override
    public User fromDTO(UserDTO dto) {
        Paciente paciente = new Paciente();
        paciente.setNome(dto.getNome());
        paciente.setCpf(dto.getCpf());
        paciente.setSenha(dto.getSenha());
        paciente.setDataNascimento(dto.getDataNascimento());

        // Convertendo String para enum, evitando NullPointerException
        paciente.setSexo(dto.getSexo() != null ? User.Sexo.valueOf(dto.getSexo()) : null);
        paciente.setEmail(dto.getEmail());
        paciente.setTelefone(dto.getTelefone());
        paciente.setEndereco(dto.getEndereco());

        paciente.setAtivo(dto.getAtivo() != null ? dto.getAtivo() : true);
        paciente.setRole(dto.getRole() != null ? User.Role.valueOf(dto.getRole()) : User.Role.ROLE_USER);


        return paciente;
    }

    @Override
    public void updateFromDTO(UserDTO dto, User user) {
        Paciente paciente = (Paciente) user;
        paciente.setNome(dto.getNome());
        paciente.setCpf(dto.getCpf());
        paciente.setDataNascimento(dto.getDataNascimento());

        if (dto.getSexo() != null) {
            paciente.setSexo(User.Sexo.valueOf(dto.getSexo()));
        }
        paciente.setEmail(dto.getEmail());
        paciente.setTelefone(dto.getTelefone());
        paciente.setEndereco(dto.getEndereco());

        if (dto.getAtivo() != null) {
            paciente.setAtivo(dto.getAtivo());
        }
        if (dto.getRole() != null) {
            paciente.setRole(User.Role.valueOf(dto.getRole()));
        }
        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            paciente.setSenha(dto.getSenha());
        }
    }
}

