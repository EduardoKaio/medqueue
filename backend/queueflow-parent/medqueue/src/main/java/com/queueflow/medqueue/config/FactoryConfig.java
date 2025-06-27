package com.queueflow.medqueue.config;

import com.queueflow.medqueue.factory.PacienteFactory;

import com.queueflow.queueflow.factory.UserFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FactoryConfig {

    @Bean
    public UserFactory userFactory() {
        return new PacienteFactory();
    }
}