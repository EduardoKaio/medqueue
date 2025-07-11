-- ============================================
-- FILA => se mantiver para VetQueue
-- ============================================

CREATE TABLE IF NOT EXISTS fila (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    ativo BOOLEAN DEFAULT TRUE,
    tempo_medio DECIMAL(5, 2) DEFAULT 0.0,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    especialidade VARCHAR(100)
);

INSERT INTO fila (nome, descricao, ativo, tempo_medio, especialidade)
VALUES 
('preferencial', 'Fila para atendimento prioritário', TRUE, 15.0, 'Clínica Geral'), 
('geral', 'Fila para atendimento geral', TRUE, 30.0, 'Vacinação');