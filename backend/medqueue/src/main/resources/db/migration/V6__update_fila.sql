ALTER TABLE fila
MODIFY COLUMN data_criacao DATE;

UPDATE fila SET data_criacao = '1900-01-01' WHERE id = 2;