package com.queueflow.bankqueue.service.auth;

import com.queueflow.bankqueue.models.Cliente;
import com.queueflow.bankqueue.repository.ClienteRepository;
import com.queueflow.queueflow.service.auth.UserDetailsServiceImpl;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
public class ClienteUserDetailsService extends UserDetailsServiceImpl<Cliente> {
    public ClienteUserDetailsService(ClienteRepository clienteRepository) {
        super(clienteRepository);
    }
}
