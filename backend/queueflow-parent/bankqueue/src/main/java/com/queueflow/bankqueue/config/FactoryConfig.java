package com.queueflow.bankqueue.config;

import com.queueflow.bankqueue.factory.ClienteFactory;

import com.queueflow.queueflow.factory.UserFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FactoryConfig {

    @Bean
    public UserFactory userFactory() {
        return new ClienteFactory();
    }
}