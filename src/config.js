module.exports = {
    PORT: 'https://limitless-castle-88524.herokuapp.com/',
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_TOKEN: process.env.API_TOKEN,
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://lili@localhost/meals',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://lili@localhost/meals-test'
}