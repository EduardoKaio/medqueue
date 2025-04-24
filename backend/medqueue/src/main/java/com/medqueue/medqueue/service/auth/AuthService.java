package com.medqueue.medqueue.service.auth;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.medqueue.medqueue.models.Paciente;
import com.medqueue.medqueue.repository.PacienteRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final PacienteRepository pacienteRepository;

    public Long getIdDoUsuario() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication.getPrincipal() instanceof UserDetails) {
             String cpf = authentication.getName();

            // Buscar o paciente pelo CPF para pegar o ID
            Paciente paciente = pacienteRepository.findByCpf(cpf)
                .orElseThrow(() -> new UsernameNotFoundException("Paciente não encontrado"));

            return paciente.getId();
        }

        return null;
    }
}
