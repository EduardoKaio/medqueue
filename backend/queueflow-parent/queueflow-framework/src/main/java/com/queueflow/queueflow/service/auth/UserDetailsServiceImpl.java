package com.queueflow.queueflow.service.auth;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.queueflow.queueflow.models.User;
import com.queueflow.queueflow.models.User.Role;
import com.queueflow.queueflow.repository.UserRepository;

import lombok.RequiredArgsConstructor;

// @Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl<T extends User> implements UserDetailsService {
    
    private final UserRepository<T> userRepository;

    @Override
    public UserDetails loadUserByUsername(String cpf) throws UsernameNotFoundException {
        T user = userRepository.findByCpf(cpf)
            .orElseThrow(() -> {
                System.err.println("[ERRO] CPF não encontrado: " + cpf);
                return new UsernameNotFoundException("Usuário não encontrado");
            });

        Role role = user.getRole();
        String roleString = role.name();

        return new org.springframework.security.core.userdetails.User(
            user.getCpf(),
            user.getSenha(),
            List.of(new SimpleGrantedAuthority(roleString))
        );
    }
}
