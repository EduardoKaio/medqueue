package com.medqueue.medqueue.service.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.medqueue.medqueue.dto.AuthRequest;
import com.medqueue.medqueue.dto.AuthResponse;
import com.medqueue.medqueue.models.Paciente;
import com.medqueue.medqueue.repository.PacienteRepository;
import com.medqueue.medqueue.util.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authManager;
    private final PacienteRepository pacienteRepository;
    private final JwtUtil jwtUtil;

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

    public AuthResponse autenticar(AuthRequest authRequest) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getCpf(), authRequest.getSenha())
        );

        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        Paciente paciente = pacienteRepository.findByCpf(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("Paciente não encontrado"));

        String jwt = jwtUtil.generateToken(userDetails, paciente.getId());
        return new AuthResponse(jwt, paciente.getRole());
    }
}
