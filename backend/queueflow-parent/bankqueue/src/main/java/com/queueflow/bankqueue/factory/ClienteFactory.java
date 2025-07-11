package com.queueflow.bankqueue.factory;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.queueflow.bankqueue.models.Cliente;
import com.queueflow.queueflow.factory.UserFactory;
import com.queueflow.queueflow.models.User;
import com.queueflow.queueflow.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicInteger;

@Component
public class ClienteFactory implements UserFactory {
    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public UserDTO toDTO(User user) {
        Cliente cliente = (Cliente) user;
        UserDTO dto = new UserDTO();
        dto.setId(cliente.getId());
        dto.setNome(cliente.getNome());
        dto.setCpf(cliente.getCpf());
        dto.setSenha(cliente.getSenha());
        dto.setDataNascimento(cliente.getDataNascimento());
        dto.setSexo(cliente.getSexo() != null ? cliente.getSexo().name() : null);
        dto.setEmail(cliente.getEmail());
        dto.setTelefone(cliente.getTelefone());
        dto.setEndereco(cliente.getEndereco());
        dto.setAtivo(cliente.getAtivo());
        dto.setRole(cliente.getRole() != null ? cliente.getRole().name() : null);
        dto.setTipoConta(cliente.getTipoConta() != null ? cliente.getTipoConta().name() : null);
        return dto;
    }

    @Override
    public Cliente fromDTO(UserDTO dto) {
        Cliente cliente = new Cliente();
        cliente.setNome(dto.getNome());
        cliente.setCpf(dto.getCpf());
        cliente.setSenha(dto.getSenha());
        cliente.setDataNascimento(dto.getDataNascimento());
        cliente.setSexo(dto.getSexo() != null ? User.Sexo.valueOf(dto.getSexo()) : null);
        cliente.setEmail(dto.getEmail());
        cliente.setTelefone(dto.getTelefone());
        cliente.setEndereco(dto.getEndereco());
        cliente.setAtivo(dto.getAtivo() != null ? dto.getAtivo() : true);
        cliente.setRole(dto.getRole() != null ? User.Role.valueOf(dto.getRole()) : User.Role.ROLE_USER);

        // tipoConta é obrigatório
        String tipoContaStr = dto.getTipoConta();
        if (tipoContaStr == null) {
            throw new IllegalArgumentException("O campo 'tipoConta' é obrigatório.");
        }
        try {
            cliente.setTipoConta(Cliente.TipoConta.valueOf(tipoContaStr));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Valor inválido para 'tipoConta': " + tipoContaStr);
        }

        cliente.setNumeroConta(gerarNumeroConta(cliente));
        cliente.setAgencia(gerarAgencia(cliente));
        return cliente;
    }

    @Override
    public void updateFromDTO(UserDTO dto, User user) {
        Cliente cliente = (Cliente) user;
        cliente.setNome(dto.getNome());
        cliente.setCpf(dto.getCpf());
        cliente.setDataNascimento(dto.getDataNascimento());
        if (dto.getSexo() != null) {
            cliente.setSexo(User.Sexo.valueOf(dto.getSexo()));
        }
        cliente.setEmail(dto.getEmail());
        cliente.setTelefone(dto.getTelefone());
        cliente.setEndereco(dto.getEndereco());
        if (dto.getAtivo() != null) {
            cliente.setAtivo(dto.getAtivo());
        }
        if (dto.getRole() != null) {
            cliente.setRole(User.Role.valueOf(dto.getRole()));
        }
        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            cliente.setSenha(dto.getSenha());
        }

        // Atualiza tipoConta, agencia e numeroConta (se permitido)
        if (dto.getTipoConta() != null) {
            cliente.setTipoConta(Cliente.TipoConta.valueOf(dto.getTipoConta()));
        }
    }

    private static final AtomicInteger contadorConta = new AtomicInteger(1000000);

    private String gerarAgencia(Cliente cliente) {
        return "0001";
    }

    private String gerarNumeroConta(Cliente cliente) {
        return String.format("%08d", System.currentTimeMillis() % 100000000);
    }
}
