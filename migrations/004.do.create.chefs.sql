CREATE TABLE IF NOT EXISTS chefs (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    chef_name TEXT NOT NULL,
    bio TEXT NOT NULL,
    cuisine TEXT NOT NULL,
    schedule TEXT NOT NULL
);