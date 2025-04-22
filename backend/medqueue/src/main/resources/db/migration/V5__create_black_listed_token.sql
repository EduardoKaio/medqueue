CREATE TABLE black_listed_token (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(512) NOT NULL,
    expiration_date DATETIME NOT NULL
)