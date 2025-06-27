CREATE TABLE IF NOT EXISTS fila (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    ativo BOOLEAN DEFAULT TRUE,
    prioridade INT DEFAULT 0,
    tempo_medio DECIMAL(5, 2) DEFAULT 0.0,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO fila (nome, descricao, ativo, prioridade, tempo_medio) VALUES 
('preferencial', 'Fila para atendimento prioritário', TRUE, 1, 15.0), 
('geral', 'Fila para atendimento geral', TRUE, 2, 30.0);