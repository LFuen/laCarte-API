module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  API_TOKEN: process.env.API_TOKEN,
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgres://zussweygrlrnbd:613aafecc17b082c0dbda029a253e5bc976267dafb4a31fe8e83e9b31a22e2a1@ec2-34-235-240-133.compute-1.amazonaws.com:5432/d98u3n95e5h16",
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL || "postgresql://lili@localhost/meals",
  CLIENT_ORIGIN:
    process.env.CLIENT_ORIGIN || "https://la-carte-lfuen.vercel.app",
};

// postgres://lxrskbiarhkudb:9b49de24d89d2474475a797fbfb140f05bb6be0e115a336730f5216460282982@ec2-34-196-34-158.compute-1.amazonaws.com:5432/d5njamcr3h74ll

// postgresql://lili@localhost/meals

//changed auth key 4/22/21
