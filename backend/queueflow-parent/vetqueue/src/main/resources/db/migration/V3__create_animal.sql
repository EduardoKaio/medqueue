CREATE TABLE animais (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raca VARCHAR(50),
    idade INT,
    dono_id BIGINT NOT NULL,
    FOREIGN KEY (dono_id) REFERENCES dono(id)
);

-- Exemplo de insert de animal
INSERT INTO animais (nome, especie, raca, idade, dono_id) VALUES ('Rex', 'Cachorro', 'Labrador', 5, 1);
INSERT INTO animais (nome, especie, raca, idade, dono_id) VALUES ('Toby', 'Gato', 'Siamês', 3, 1);
INSERT INTO animais (nome, especie, raca, idade, dono_id) VALUES ('Bidu', 'Cachorro', 'Beagle', 4, 1);
