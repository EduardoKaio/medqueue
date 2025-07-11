package com.queueflow.vetqueue.config;

import com.queueflow.vetqueue.factory.DonoFactory;

import com.queueflow.queueflow.factory.UserFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FactoryConfig {

    @Bean
    public UserFactory userFactory() {
        return new DonoFactory();
    }
}