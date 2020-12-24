#!/bin/bash

npm run migrate -- 0
npm run migrate
psql -U lili -d meals -f ./seeds/seed.cuisines.sql
psql -U lili -d meals -f ./seeds/seed.chefs.sql
psql -U lili -d meals -f ./seeds/seed.meals.sql
psql -U lili -d meals -f ./seeds/seed.orders.sql