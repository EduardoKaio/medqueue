package com.queueflow.queueflow.controller.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.queueflow.queueflow.dto.AuthRequest;
import com.queueflow.queueflow.dto.AuthResponse;
import com.queueflow.queueflow.dto.UserDTO;
import com.queueflow.queueflow.models.BlackListedToken;
import com.queueflow.queueflow.repository.BlackListedRepository;
import com.queueflow.queueflow.service.admin.UserService;
import com.queueflow.queueflow.service.auth.AuthService;
import com.queueflow.queueflow.util.JwtUtil;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    private final UserService userService;

    private final AuthService authService;

    @Autowired
    private BlackListedRepository blacklistRepository;

    @PostMapping("/register")
    @Operation(summary = "Cadastrar novo user")
    public ResponseEntity<UserDTO> criar(@RequestBody UserDTO userDTO) {
        UserDTO novoUser = userService.criar(userDTO);
        return ResponseEntity.ok(novoUser);
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
