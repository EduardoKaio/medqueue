package com.medqueue.medqueue.controller.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medqueue.medqueue.dto.AuthRequest;
import com.medqueue.medqueue.dto.AuthResponse;
import com.medqueue.medqueue.dto.PacienteDTO;
import com.medqueue.medqueue.models.BlackListedToken;
import com.medqueue.medqueue.repository.BlackListedRepository;
import com.medqueue.medqueue.service.admin.PacienteService;
import com.medqueue.medqueue.service.auth.AuthService;
import com.medqueue.medqueue.util.JwtUtil;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    private final PacienteService pacienteService;

    private final AuthService authService;

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
            AuthResponse response = authService.autenticar(authRequest);
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");  // Retira o "Bearer" do token

        // Adiciona o token à blacklist com a data de expiração
        blacklistRepository.save(new BlackListedToken(token, jwtUtil.getExpirationDate(token)));

        return ResponseEntity.ok("Logout realizado com sucesso");
    }
}
