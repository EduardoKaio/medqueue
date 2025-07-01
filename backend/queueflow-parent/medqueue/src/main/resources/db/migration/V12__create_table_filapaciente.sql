CREATE TABLE fila_paciente (
    id BIGINT PRIMARY KEY,
    FOREIGN KEY (id) REFERENCES fila_user(id)
);
