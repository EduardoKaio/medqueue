CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
    sexo ENUM('M', 'F', 'Outro') NOT NULL,
    email VARCHAR(100),
    telefone VARCHAR(20),
    endereco VARCHAR(255),
    ativo BOOLEAN DEFAULT TRUE,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    user_type VARCHAR(50) NOT NULL DEFAULT 'DONO'
);

INSERT INTO users (nome, cpf, data_nascimento, sexo, email, telefone, endereco, ativo, senha, role)
VALUES
('João Dono', '123.456.789-00', '1990-05-15', 'M', 'joao.dono@email.com', '(11) 91234-5678', 'Rua A, 123 - São Paulo, SP', TRUE, 
 '$2a$10$EVtBG.Ys14EtzK3YFGEkQOYqIZNJPu6erxzqR6jBtuAcMSXy9Rk2C', 'ROLE_USER'),
('Maria Dono', '987.654.321-00', '1985-09-20', 'F', 'maria.dono@email.com', '(21) 99876-5432', 'Av. B, 456 - Rio de Janeiro, RJ', TRUE,
 '$2a$10$EVtBG.Ys14EtzK3YFGEkQOYqIZNJPu6erxzqR6jBtuAcMSXy9Rk2C', 'ROLE_USER'),
('Administrador', '000.000.000-00', '1980-01-01', 'M', 'admin@vetqueue.com', '(00) 00000-0000', 'Endereço Admin', TRUE,
 '$2a$10$EVtBG.Ys14EtzK3YFGEkQOYqIZNJPu6erxzqR6jBtuAcMSXy9Rk2C', 'ROLE_ADMIN');

 CREATE TABLE dono (
    id BIGINT PRIMARY KEY,
    FOREIGN KEY (id) REFERENCES users(id)
);

-- Insere todos os users que são donos na tabela dono
INSERT INTO dono (id)
SELECT id FROM users WHERE user_type = 'DONO';