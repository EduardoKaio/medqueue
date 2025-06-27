CREATE TABLE user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    data_nascimento DATE NOT NULL,
    sexo ENUM('M', 'F', 'Outro') NOT NULL,
    email VARCHAR(100),
    telefone VARCHAR(20),
    endereco VARCHAR(255),
    ativo BOOLEAN DEFAULT TRUE
);

INSERT INTO user (nome, cpf, data_nascimento, sexo, email, telefone, endereco, ativo) VALUES
('João da Silva', '123.456.789-00', '1990-05-15', 'M', 'joao.silva@email.com', '(11) 91234-5678', 'Rua A, 123 - São Paulo, SP', TRUE),
('Maria Oliveira', '987.654.321-00', '1985-09-20', 'F', 'maria.oliveira@email.com', '(21) 99876-5432', 'Av. B, 456 - Rio de Janeiro, RJ', TRUE),
('Alex Santos', '111.222.333-44', '2000-01-10', 'Outro', 'alex.santos@email.com', '(31) 93456-7890', 'Rua C, 789 - Belo Horizonte, MG', TRUE);
