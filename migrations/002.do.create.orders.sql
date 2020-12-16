CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    prim_add varchar NOT NULL,
    sec_add varchar,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip INTEGER NOT NULL,
    phone NUMERIC NOT NULL
);