package com.queueflow.queueflow.service.admin;

import java.util.List;
import java.util.stream.Collectors;

import com.queueflow.queueflow.dto.UserDTO;
import com.queueflow.queueflow.factory.UserFactory;
import com.queueflow.queueflow.repository.EntityRepository;
import com.queueflow.queueflow.models.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService<T extends User> {

    private final EntityRepository<T> entityRepository;
    private final UserFactory userFactory;
    private final PasswordEncoder passwordEncoder;

    public List<UserDTO> listarTodos() {
        return entityRepository.findAll()
                .stream()
                .map(userFactory::toDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> listarAtivos() {
        return entityRepository.findByAtivoTrue()
                .stream()
                .map(userFactory::toDTO)
                .collect(Collectors.toList());
    }

    public UserDTO buscarPorId(Long id) {
        User user = entityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado com ID: " + id));
        return userFactory.toDTO(user);
    }

    public UserDTO criar(UserDTO userDTO) {
        if (entityRepository.existsByCpf(userDTO.getCpf())) {
            throw new IllegalArgumentException("Já existe um usuário com esse CPF.");
        }

        T user = (T) userFactory.fromDTO(userDTO);
        user.setSenha(passwordEncoder.encode(user.getSenha()));

        T salvo = entityRepository.save(user);
        return userFactory.toDTO(salvo);
    }

    public UserDTO atualizar(Long id, UserDTO userDTO) {
        T existente = entityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado com ID: " + id));

        if (userDTO.getNome() == null || userDTO.getNome().isBlank()
                || userDTO.getCpf() == null || userDTO.getCpf().isBlank()
                || userDTO.getSexo() == null || userDTO.getSexo().isBlank()
                || userDTO.getDataNascimento() == null) {
            throw new IllegalArgumentException("Todos os campos obrigatórios devem ser preenchidos.");
        }

        if (!userDTO.getCpf().equals(existente.getCpf()) && entityRepository.existsByCpf(userDTO.getCpf())) {
            throw new IllegalArgumentException("Já existe um usuário com esse CPF.");
        }

        String genero = userDTO.getSexo();
        if (!genero.equalsIgnoreCase("M") && !genero.equalsIgnoreCase("F") && !genero.equalsIgnoreCase("Outro")) {
            throw new IllegalArgumentException("Gênero inválido. Os valores aceitos são: M, F ou Outro.");
        }

        String senhaAntiga = existente.getSenha();
        userFactory.updateFromDTO(userDTO, existente);

        if (userDTO.getSenha() != null && !userDTO.getSenha().isBlank()) {
            existente.setSenha(passwordEncoder.encode(userDTO.getSenha()));
        } else {
            existente.setSenha(senhaAntiga);
        }

        T atualizado = entityRepository.save(existente);
        return userFactory.toDTO(atualizado);
    }

    public void deletar(Long id) {
        T user = entityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado com ID: " + id));
        entityRepository.delete(user);
    }

    public long getContagem() {
        return entityRepository.count();
    }
}
