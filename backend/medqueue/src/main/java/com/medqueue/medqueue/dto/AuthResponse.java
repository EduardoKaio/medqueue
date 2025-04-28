package com.medqueue.medqueue.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import com.medqueue.medqueue.models.Paciente.Role;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Role role;
}
