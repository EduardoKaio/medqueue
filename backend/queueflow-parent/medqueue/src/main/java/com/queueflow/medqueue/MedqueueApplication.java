package com.queueflow.medqueue;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {
        "com.queueflow.medqueue",           // seu projeto atual
        "com.queueflow.queueflow"  // ajuste aqui para o pacote base real do framework
})
@EntityScan(basePackages = {
        "com.queueflow.queueflow.models",
        "com.queueflow.medqueue.models"  // ajuste com o caminho dos seus @Entity
})
@EnableJpaRepositories(basePackages = {
        "com.queueflow.queueflow.repository",
        "com.queueflow.medqueue.repository" // ajuste com o caminho dos seus repositórios
})
public class MedqueueApplication {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load();
        dotenv.entries().forEach(entry ->
                System.setProperty(entry.getKey(), entry.getValue())
        );
        SpringApplication.run(MedqueueApplication.class, args);
    }
}
