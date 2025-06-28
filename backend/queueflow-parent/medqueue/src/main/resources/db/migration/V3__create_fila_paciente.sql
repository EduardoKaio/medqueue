CREATE TABLE IF NOT EXISTS fila_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    fila_id BIGINT NOT NULL,
    posicao INT NOT NULL,
    data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atendido BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (fila_id) REFERENCES fila(id)
);

CREATE INDEX idx_fila_user_fila_id ON fila_user(fila_id);
CREATE INDEX idx_fila_user_user_id ON fila_user(user_id);
CREATE INDEX idx_fila_user_atendido ON fila_user(atendido);

INSERT INTO fila_user (user_id, fila_id, posicao, data_entrada, created_at)
VALUES (1, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO fila_user (user_id, fila_id, posicao, data_entrada, created_at)
VALUES (2, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO fila_user (user_id, fila_id, posicao, data_entrada, created_at)
VALUES (3, 2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);