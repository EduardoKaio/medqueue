-- Remove a coluna 'prioridade'
ALTER TABLE fila
DROP COLUMN prioridade;

-- Adiciona a nova coluna 'especialidade'
ALTER TABLE fila
ADD COLUMN especialidade VARCHAR(100);

-- Adiciona a coluna 'prioridade' na tabela 'fila_paciente'
ALTER TABLE fila_paciente
ADD COLUMN prioridade INT CHECK (prioridade IN (1, 2, 3));