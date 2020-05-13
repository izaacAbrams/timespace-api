module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  API_TOKEN: process.env.API_TOKEN,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
  DATABASE_URL:
    process.env.DATABASE_URL || "postgresql://postgres@localhost/timespace",
};
