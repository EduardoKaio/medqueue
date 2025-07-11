package com.queueflow.vetqueue.factory;

import com.queueflow.queueflow.dto.UserDTO;
import com.queueflow.queueflow.factory.UserFactory;
import com.queueflow.queueflow.models.User;
import com.queueflow.vetqueue.models.Dono;
import org.springframework.stereotype.Component;

@Component
public class DonoFactory implements UserFactory {

    @Override
    public UserDTO toDTO(User user) {
        Dono dono = (Dono) user;
        UserDTO dto = new UserDTO();
        dto.setId(dono.getId());
        dto.setNome(dono.getNome());
        dto.setCpf(dono.getCpf());
        dto.setSenha(dono.getSenha());
        dto.setDataNascimento(dono.getDataNascimento());

        dto.setSexo(dono.getSexo() != null ? dono.getSexo().name() : null);
        dto.setEmail(dono.getEmail());
        dto.setTelefone(dono.getTelefone());
        dto.setEndereco(dono.getEndereco());

        dto.setAtivo(dono.getAtivo());
        dto.setRole(dono.getRole() != null ? dono.getRole().name() : null);

        return dto;
    }

    @Override
    public User fromDTO(UserDTO dto) {
        Dono dono = new Dono();
        dono.setNome(dto.getNome());
        dono.setCpf(dto.getCpf());
        dono.setSenha(dto.getSenha());
        dono.setDataNascimento(dto.getDataNascimento());

        dono.setSexo(dto.getSexo() != null ? User.Sexo.valueOf(dto.getSexo()) : null);
        dono.setEmail(dto.getEmail());
        dono.setTelefone(dto.getTelefone());
        dono.setEndereco(dto.getEndereco());

        dono.setAtivo(dto.getAtivo() != null ? dto.getAtivo() : true);
        dono.setRole(dto.getRole() != null ? User.Role.valueOf(dto.getRole()) : User.Role.ROLE_USER);

        return dono;
    }

    @Override
    public void updateFromDTO(UserDTO dto, User user) {
        Dono dono = (Dono) user;
        dono.setNome(dto.getNome());
        dono.setCpf(dto.getCpf());
        dono.setDataNascimento(dto.getDataNascimento());

        if (dto.getSexo() != null) {
            dono.setSexo(User.Sexo.valueOf(dto.getSexo()));
        }
        dono.setEmail(dto.getEmail());
        dono.setTelefone(dto.getTelefone());
        dono.setEndereco(dto.getEndereco());

        if (dto.getAtivo() != null) {
            dono.setAtivo(dto.getAtivo());
        }
        if (dto.getRole() != null) {
            dono.setRole(User.Role.valueOf(dto.getRole()));
        }
        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            dono.setSenha(dto.getSenha());
        }
    }
}
