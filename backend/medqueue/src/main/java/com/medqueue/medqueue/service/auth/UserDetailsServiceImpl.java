package com.medqueue.medqueue.service.auth;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.medqueue.medqueue.models.Paciente;
import com.medqueue.medqueue.models.Paciente.Role;
import com.medqueue.medqueue.repository.PacienteRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    
    private final PacienteRepository pacienteRepository;

    @Override
    public UserDetails loadUserByUsername(String cpf) throws UsernameNotFoundException {        
        Paciente user = pacienteRepository.findByCpf(cpf)
            .orElseThrow(() -> {
                System.err.println("[ERRO] CPF não encontrado: " + cpf);
                return new UsernameNotFoundException("Usuário não encontrado");
            });

        Role role = user.getRole();
        String roleString = role.name();

        return new org.springframework.security.core.userdetails.User(
            user.getCpf(),
            user.getSenha(), // DEVE SER UM HASH (ex: BCrypt)
            List.of(new SimpleGrantedAuthority(roleString))
        );
    }
}