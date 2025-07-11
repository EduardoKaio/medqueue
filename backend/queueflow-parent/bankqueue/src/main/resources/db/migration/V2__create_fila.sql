CREATE TABLE IF NOT EXISTS fila (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    ativo BOOLEAN DEFAULT TRUE,
    tempo_medio DECIMAL(5, 2) DEFAULT 0.0,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    especialidade VARCHAR(100)
);

-- Inserção filas existentes + novas filas para BankQueue
INSERT INTO fila (nome, descricao, ativo, tempo_medio, especialidade)
VALUES 
('caixa_eletronico', 'Fila para atendimento no caixa eletrônico', TRUE, 10.0, 'Caixa Eletrônico'),
('guiche_atendimento', 'Fila para atendimento no guichê', TRUE, 20.0, 'Guichê de Atendimento'),
('gerente_conta', 'Fila para atendimento com gerente de conta', TRUE, 25.0, 'Gerente de Conta');