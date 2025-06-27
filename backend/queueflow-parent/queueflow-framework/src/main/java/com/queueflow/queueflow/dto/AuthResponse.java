package com.queueflow.queueflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import com.queueflow.queueflow.models.User.Role;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Role role;
}
