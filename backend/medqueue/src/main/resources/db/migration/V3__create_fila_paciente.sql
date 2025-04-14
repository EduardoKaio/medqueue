CREATE TABLE IF NOT EXISTS fila_paciente (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    paciente_id BIGINT NOT NULL,
    fila_id BIGINT NOT NULL,
    posicao INT NOT NULL,
    data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atendido BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (paciente_id) REFERENCES paciente(id),
    FOREIGN KEY (fila_id) REFERENCES fila(id)
);

INSERT INTO fila_paciente (paciente_id, fila_id, posicao)
VALUES (1, 1, 1);

INSERT INTO fila_paciente (paciente_id, fila_id, posicao)
VALUES (2, 2, 1);

INSERT INTO fila_paciente (paciente_id, fila_id, posicao)
VALUES (3, 2, 2);