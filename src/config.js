module.exports = {
    PORT: 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_TOKEN: process.env.API_TOKEN,
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://lili@localhost/meals',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://lili@localhost/meals'
}

