BEGIN;

INSERT INTO chefs
    (chef_name, bio, cuisine)
VALUES
('Johnathan', 
'Fake BIO goes here.',
('American', 'Asian', 'Greek', 'Indian', 'Latin American', 'Mexican', 'Middle Eastern', 'Spanish', 'Thai')),

('Francesca', 
'Fake BIO goes here.',
('Asian', 'Greek', 'Italian', 'Latin American', 'Mexican', 'Spanish')),

('Christian', 
'Fake BIO goes here.',
('American', 'Asian', 'French', 'Indian', 'Mexican', 'Spanish')),

('Madelyn', 
'Fake BIO goes here.',
('American', 'Asian', 'Greek', 'Indian', 'Mexican', 'Thai')),

('Joaquin', 
'Fake BIO goes here.',
('French', 'Greek', 'Italian', 'Latin American', 'Mexican', 'Middle Eastern', 'Thai'));


COMMIT;