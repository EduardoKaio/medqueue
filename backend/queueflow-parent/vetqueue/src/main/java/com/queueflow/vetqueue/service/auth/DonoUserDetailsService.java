package com.queueflow.vetqueue.service.auth;

import com.queueflow.vetqueue.models.Dono;
import com.queueflow.vetqueue.repository.DonoRepository;
import com.queueflow.queueflow.service.auth.UserDetailsServiceImpl;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
public class DonoUserDetailsService extends UserDetailsServiceImpl<Dono> {
    public DonoUserDetailsService(DonoRepository donoRepository) {
        super(donoRepository);
    }
}
