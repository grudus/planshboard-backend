CREATE TABLE IF NOT EXISTS users
(
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(255) NOT NULL UNIQUE,
    password      VARCHAR(255)          DEFAULT NULL,
    register_date TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS board_games
(
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    creator_id BIGINT       NOT NULL REFERENCES users ON DELETE CASCADE,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    CONSTRAINT UNIQUE_BOARD_GAME_NAME UNIQUE (name, creator_id)
);

CREATE TABLE IF NOT EXISTS linked_board_games
(
    board_game_id  BIGSERIAL NOT NULL REFERENCES board_games (id),
    linked_user_id BIGSERIAL NOT NULL REFERENCES users (id),
    hidden         BOOLEAN   NOT NULL DEFAULT FALSE,
    CONSTRAINT UNIQUE_LINKED_BOARDGAMES UNIQUE (board_game_id, linked_user_id)
);
