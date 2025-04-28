# Usar a imagem base do JDK (Java Development Kit)
FROM openjdk:21-jdk-slim

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar o arquivo JAR gerado pela compilação do Spring (assumindo que você usa Maven ou Gradle)
COPY target/medqueue-0.0.1-SNAPSHOT.jar /app/medqueue.jar

# Copiar o arquivo .env (caso você queira usar ele diretamente)
COPY .env /app/.env

# Expor a porta que o Spring vai usar
EXPOSE 8081

# Comando para rodar a aplicação
CMD ["java", "-jar", "/app/medqueue.jar"]
