package com.queueflow.vetqueue;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;


@SpringBootApplication
@ComponentScan(basePackages = {
        "com.queueflow.vetqueue",           // seu projeto atual
        "com.queueflow.queueflow"  // ajuste aqui para o pacote base real do framework
})
@EntityScan(basePackages = {
        "com.queueflow.queueflow.models",
        "com.queueflow.vetqueue.models"  // ajuste com o caminho dos seus @Entity
})
@EnableJpaRepositories(basePackages = {
        "com.queueflow.queueflow.repository",
        "com.queueflow.vetqueue.repository" // ajuste com o caminho dos seus repositórios
})
public class VetqueueApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.load();
        dotenv.entries().forEach(entry ->
                System.setProperty(entry.getKey(), entry.getValue())
        );
		SpringApplication.run(VetqueueApplication.class, args);
	}

}
