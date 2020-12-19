module.exports = {
    PORT: 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_TOKEN: process.env.API_TOKEN,
    DATABASE_URL: process.env.DATABASE_URL || 'postgres://umaaznjedfinhc:a79f0a8df16cb71b6b52b1cb9f6989b353067a17ea2bc5b690438aecef6d756e@ec2-50-19-247-157.compute-1.amazonaws.com:5432/d4bep6dih2u8j0',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgres://umaaznjedfinhc:a79f0a8df16cb71b6b52b1cb9f6989b353067a17ea2bc5b690438aecef6d756e@ec2-50-19-247-157.compute-1.amazonaws.com:5432/d4bep6dih2u8j0'
}

