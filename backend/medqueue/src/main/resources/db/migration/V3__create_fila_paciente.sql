CREATE TABLE IF NOT EXISTS fila_paciente (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    paciente_id BIGINT NOT NULL,
    fila_id BIGINT NOT NULL,
    posicao INT NOT NULL,
    data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atendido BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (paciente_id) REFERENCES paciente(id),
    FOREIGN KEY (fila_id) REFERENCES fila(id)
);

CREATE INDEX idx_fila_paciente_fila_id ON fila_paciente(fila_id);
CREATE INDEX idx_fila_paciente_paciente_id ON fila_paciente(paciente_id);
CREATE INDEX idx_fila_paciente_atendido ON fila_paciente(atendido);

INSERT INTO fila_paciente (paciente_id, fila_id, posicao, data_entrada, created_at)
VALUES (1, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO fila_paciente (paciente_id, fila_id, posicao, data_entrada, created_at)
VALUES (2, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO fila_paciente (paciente_id, fila_id, posicao, data_entrada, created_at)
VALUES (3, 2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);