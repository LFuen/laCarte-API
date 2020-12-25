module.exports = {
    PORT: process.env.PORT || 5432,
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_TOKEN: process.env.API_TOKEN,
    DATABASE_URL: process.env.DATABASE_URL || 'postgres://oderdmjkmivvjz:11c0d01390f5d6e69f768b2bc4cd2ad86eb2f09b1979a918e1a2ef43f62df170@ec2-3-224-38-18.compute-1.amazonaws.com:5432/dd086b5ocq93ld',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgres://oderdmjkmivvjz:11c0d01390f5d6e69f768b2bc4cd2ad86eb2f09b1979a918e1a2ef43f62df170@ec2-3-224-38-18.compute-1.amazonaws.com:5432/dd086b5ocq93ld'
}

// postgres://oderdmjkmivvjz:11c0d01390f5d6e69f768b2bc4cd2ad86eb2f09b1979a918e1a2ef43f62df170@ec2-3-224-38-18.compute-1.amazonaws.com:5432/dd086b5ocq93ld

// postgresql://lili@localhost/meals