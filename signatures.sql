DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures (
    id SERIAL primary key,
    first VARCHAR(255) NOT NULL CHECK (first !=''),
    last VARCHAR(255) NOT NULL CHECK (last !=''),
    sig TEXT NOT NULL CHECK (sig !=''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);