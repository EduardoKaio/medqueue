-- ======================================
-- Fila de User (CLIENTE) para BANKQUEUE
-- ======================================

CREATE TABLE IF NOT EXISTS fila_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    fila_id BIGINT NOT NULL,
    posicao INT NOT NULL,
    data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atendido BOOLEAN DEFAULT FALSE,
    prioridade INT CHECK (prioridade IN (1, 2, 3)),
    check_in BOOLEAN NOT NULL DEFAULT FALSE,
    notificado BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(255) NOT NULL DEFAULT 'Na fila',
    dtype VARCHAR(50) NOT NULL DEFAULT 'FILA_CLIENTE',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (fila_id) REFERENCES fila(id)
);

-- Índices coerentes
CREATE INDEX idx_fila_user_fila_id ON fila_user(fila_id);
CREATE INDEX idx_fila_user_user_id ON fila_user(user_id);
CREATE INDEX idx_fila_user_atendido ON fila_user(atendido);

-- Exemplos de inserts coerentes (users na fila)
INSERT INTO fila_user (user_id, fila_id, posicao) VALUES (1, 1, 1);
INSERT INTO fila_user (user_id, fila_id, posicao) VALUES (2, 2, 1);
INSERT INTO fila_user (user_id, fila_id, posicao) VALUES (3, 3, 1);

-- Se precisar de uma tabela filha com informações específicas:
CREATE TABLE fila_cliente(
    id BIGINT PRIMARY KEY,
    FOREIGN KEY (id) REFERENCES fila_user(id)
);
