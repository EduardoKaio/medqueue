ALTER TABLE fila_user ADD COLUMN user_id BIGINT NULL;
ALTER TABLE fila_user ADD CONSTRAINT fk_fila_user_user FOREIGN KEY (user_id) REFERENCES users(id);
CREATE INDEX idx_fila_user_user_id ON fila_user(user_id);