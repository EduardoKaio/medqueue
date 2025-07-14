package com.queueflow.queueflow.service.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.queueflow.queueflow.dto.AuthRequest;
import com.queueflow.queueflow.dto.AuthResponse;
import com.queueflow.queueflow.models.User;
import com.queueflow.queueflow.repository.EntityRepository;
import com.queueflow.queueflow.util.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService<T extends User> {

    private final AuthenticationManager authManager;
    private final EntityRepository<T> entityRepository;
    private final JwtUtil jwtUtil;

    public Long getIdDoUsuario() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication.getPrincipal() instanceof UserDetails) {
            String cpf = authentication.getName();

            // Buscar o user pelo CPF para pegar o ID
            T user = entityRepository.findByCpf(cpf)
                    .orElseThrow(() -> new UsernameNotFoundException("User não encontrado"));

            return user.getId();
        }
        return null;
    }

    public AuthResponse autenticar(AuthRequest authRequest) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getCpf(), authRequest.getSenha())
        );

        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        T user = entityRepository.findByCpf(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User não encontrado"));

        String jwt = jwtUtil.generateToken(userDetails, user.getId());
        return new AuthResponse(jwt, user.getRole());
    }
}
