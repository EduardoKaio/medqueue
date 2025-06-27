ALTER TABLE user ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER';
ALTER TABLE user ADD COLUMN senha VARCHAR(255) NOT NULL;

UPDATE user
SET senha = '$2a$10$EVtBG.Ys14EtzK3YFGEkQOYqIZNJPu6erxzqR6jBtuAcMSXy9Rk2C';

INSERT INTO user (
    nome, cpf, senha, data_nascimento, sexo, email, telefone, endereco, ativo, role
) VALUES (
    'Administrador', '000.000.000-00', 
    '$2a$10$EVtBG.Ys14EtzK3YFGEkQOYqIZNJPu6erxzqR6jBtuAcMSXy9Rk2C', -- senha: 123456
    '1980-01-01', 'M', 'admin@clinica.com', '(00) 00000-0000', 'Endereço Admin', TRUE, 
    'ROLE_ADMIN'
);