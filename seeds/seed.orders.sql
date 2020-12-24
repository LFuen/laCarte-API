BEGIN;

INSERT INTO orders
    (prim_add, sec_add, city, state, zip, phone, meal)
VALUES
('123 Main Street',
'',
'Beltsville',
'Kansas',
'90218',
2018675309,
'Ceviche');

COMMIT;