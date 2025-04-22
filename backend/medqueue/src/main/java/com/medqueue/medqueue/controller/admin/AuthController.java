package com.medqueue.medqueue.controller.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties.Jwt;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import com.medqueue.medqueue.dto.AuthRequest;
import com.medqueue.medqueue.dto.AuthResponse;
import com.medqueue.medqueue.dto.PacienteDTO;
import com.medqueue.medqueue.models.BlackListedToken;
import com.medqueue.medqueue.models.Paciente;
import com.medqueue.medqueue.repository.BlackListedRepository;
import com.medqueue.medqueue.repository.PacienteRepository;
import com.medqueue.medqueue.service.admin.PacienteService;
import com.medqueue.medqueue.util.JwtUtil;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtUtil jwtUtil;

    private final PacienteService pacienteService;

    private final PacienteRepository pacienteRepository;

    @Autowired
    private BlackListedRepository blacklistRepository;

    @PostMapping("/register")
    @Operation(summary = "Cadastrar novo paciente")
    public ResponseEntity<PacienteDTO> criar(@RequestBody PacienteDTO pacienteDTO) {
        PacienteDTO novoPaciente = pacienteService.criar(pacienteDTO);
        return ResponseEntity.ok(novoPaciente);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        try {
            Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getCpf(), authRequest.getSenha())
            );

            final UserDetails userDetails = (UserDetails) auth.getPrincipal();
            String cpf = userDetails.getUsername();

            // Buscar o paciente pelo CPF para pegar o ID
            Paciente paciente = pacienteRepository.findByCpf(cpf)
                .orElseThrow(() -> new UsernameNotFoundException("Paciente não encontrado"));

            final String jwt = jwtUtil.generateToken(userDetails, paciente.getId());

            return ResponseEntity.ok(new AuthResponse(jwt));

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas");
        }
    }

    @GetMapping("/currentUser")
    public String getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.isAuthenticated()) {
            String cpf = authentication.getName();  // Exemplo: Obtendo o CPF do JWT
            
            if (authentication.getPrincipal() instanceof Jwt) {
                System.out.println(authentication.getPrincipal());               
            }

            return "Usuário logado: " + cpf;
        }
        
        return "Não autenticado";
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");  // Retira o "Bearer" do token

        // Adiciona o token à blacklist com a data de expiração
        blacklistRepository.save(new BlackListedToken(token, jwtUtil.getExpirationDate(token)));

        return ResponseEntity.ok("Logout realizado com sucesso");
    }
}
