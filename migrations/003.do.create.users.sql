CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    username varchar NOT NULL,
    email varchar NOT NULL,
    pass varchar NOT NULL,
    subscription TEXT NOT NULL
);