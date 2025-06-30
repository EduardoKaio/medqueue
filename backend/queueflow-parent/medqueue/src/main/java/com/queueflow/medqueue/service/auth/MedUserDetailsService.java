package com.queueflow.medqueue.service.auth;

import com.queueflow.medqueue.models.Paciente;
import com.queueflow.medqueue.repository.PacienteRepository;
import com.queueflow.queueflow.service.auth.UserDetailsServiceImpl;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
public class MedUserDetailsService extends UserDetailsServiceImpl<Paciente> {
    public MedUserDetailsService(PacienteRepository pacienteRepository) {
        super(pacienteRepository);
    }
}
