BEGIN;

INSERT INTO chefs
    (chef_name, bio, cuisine, schedule)
VALUES
('Johnathan', 
'Fake BIO goes here.',
('American', 'Asian', 'Greek', 'Indian', 'Latin American', 'Mexican', 'Middle Eastern', 'Spanish', 'Thai'),
('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),

('Francesca', 
'Fake BIO goes here.',
('Asian', 'Greek', 'Italian', 'Latin American', 'Mexican', 'Spanish'),
('Monday', 'Tuesday', 'Saturday', 'Sunday')),

('Christian', 
'Fake BIO goes here.',
('American', 'Asian', 'French', 'Indian', 'Mexican', 'Spanish'),
('Thursday', 'Friday', 'Saturday', 'Sunday')),

('Madelyn', 
'Fake BIO goes here.',
('American', 'Asian', 'Greek', 'Indian', 'Mexican', 'Thai'),
('Monday', 'Tuesday', 'Wednesday', 'Sunday')),

('Joaquin', 
'Fake BIO goes here.',
('French', 'Greek', 'Italian', 'Latin American', 'Mexican', 'Middle Eastern', 'Thai'),
('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'));


COMMIT;