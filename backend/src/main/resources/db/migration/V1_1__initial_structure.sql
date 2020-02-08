CREATE TABLE IF NOT EXISTS users (
  id            BIGSERIAL PRIMARY KEY,
  name          VARCHAR(255) NOT NULL UNIQUE,
  password      VARCHAR(255)                          DEFAULT NULL,
  token         VARCHAR(255),
  register_date timestamp     NOT NULL                 DEFAULT NOW()
);
