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
    user_type VARCHAR(50) NOT NULL DEFAULT 'CLIENTE'
);

-- Inserção exemplo (todos com user_type = CLIENTE)
INSERT INTO users (nome, cpf, data_nascimento, sexo, email, telefone, endereco, ativo, senha, role, user_type)
VALUES
('João Cliente', '123.456.789-00', '1990-05-15', 'M', 'joao.cliente@email.com', '(11) 91234-5678', 'Rua A, 123 - São Paulo, SP', TRUE, 
 '$2a$10$EVtBG.Ys14EtzK3YFGEkQOYqIZNJPu6erxzqR6jBtuAcMSXy9Rk2C', 'ROLE_USER', 'CLIENTE'),
('Maria Cliente', '987.654.321-00', '1985-09-20', 'F', 'maria.cliente@email.com', '(21) 99876-5432', 'Av. B, 456 - Rio de Janeiro, RJ', TRUE,
 '$2a$10$EVtBG.Ys14EtzK3YFGEkQOYqIZNJPu6erxzqR6jBtuAcMSXy9Rk2C', 'ROLE_USER', 'CLIENTE'),
('Administrador', '000.000.000-00', '1980-01-01', 'M', 'admin@vetqueue.com', '(00) 00000-0000', 'Endereço Admin', TRUE,
 '$2a$10$EVtBG.Ys14EtzK3YFGEkQOYqIZNJPu6erxzqR6jBtuAcMSXy9Rk2C', 'ROLE_ADMIN', 'CLIENTE');

-- Tabela filha cliente, com campos bancários
CREATE TABLE cliente (
    id BIGINT PRIMARY KEY,
    numero_conta VARCHAR(50) NOT NULL UNIQUE,
    agencia VARCHAR(20) NOT NULL,
    tipo_conta ENUM('CORRENTE', 'POUPANCA', 'SALARIO', 'INVESTIMENTO') NOT NULL,
    FOREIGN KEY (id) REFERENCES users(id)
);

-- Inserir clientes para TODOS os users exceto administradores (role != 'ROLE_ADMIN')
-- Com dados padrão para conta/agência/tipo
INSERT INTO cliente (id, numero_conta, agencia, tipo_conta)
SELECT 
  id, 
  CONCAT('0000000', id), -- exemplo: número da conta gerado dinamicamente
  '0001',               -- agência padrão
  'CORRENTE'            -- tipo padrão
FROM users
WHERE role != 'ROLE_ADMIN';