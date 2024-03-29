CREATE TABLE IF NOT EXISTS users
(
    id            BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name          VARCHAR(255) NOT NULL UNIQUE,
    password      VARCHAR(255)          DEFAULT NULL,
    register_date TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS board_games
(
    id         BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    creator_id BIGINT       NOT NULL REFERENCES users ON DELETE CASCADE,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    CONSTRAINT UNIQUE_BOARD_GAME_NAME UNIQUE (name, creator_id)
);

CREATE INDEX ON board_games (name);
CREATE INDEX ON board_games (creator_id);


CREATE TYPE board_game_type AS ENUM ('REGULAR', 'COOPERATIVE');

CREATE TABLE IF NOT EXISTS board_game_options
(
    board_game_id BIGINT          NOT NULL REFERENCES board_games (id) ON DELETE CASCADE,
    game_type     board_game_type NOT NULL DEFAULT 'REGULAR',
    show_points   BOOLEAN         NOT NULL DEFAULT TRUE,
    show_position BOOLEAN         NOT NULL DEFAULT TRUE,
    show_note     BOOLEAN         NOT NULL DEFAULT TRUE,
    show_date     BOOLEAN         NOT NULL DEFAULT TRUE,
    show_tags     BOOLEAN         NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS linked_board_games
(
    creator_board_game_id            BIGINT  NOT NULL REFERENCES board_games (id) ON DELETE CASCADE,
    linked_user_id                   BIGINT  NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    linked_user_merged_board_game_id BIGINT  NULL REFERENCES board_games (id) ON DELETE CASCADE,
    hidden                           BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT UNIQUE_LINKED_BOARDGAMES UNIQUE (creator_board_game_id, linked_user_id),
    CONSTRAINT UNIQUE_MERGED_BOARD_GAME UNIQUE (linked_user_merged_board_game_id)
);

CREATE TABLE IF NOT EXISTS opponents
(
    id         BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    creator_id BIGINT       NOT NULL REFERENCES users ON DELETE CASCADE,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW(),

    CONSTRAINT UNIQUE_OPPONENT_NAME UNIQUE (name, creator_id)
);

CREATE INDEX ON opponents (name);
CREATE INDEX ON opponents (creator_id);

CREATE TYPE linked_opponent_status AS ENUM ('WAITING_FOR_CONFIRMATION', 'ENABLED', 'DISABLED', 'LINKED_WITH_CREATOR');


CREATE TABLE IF NOT EXISTS linked_opponents
(
    opponent_id        BIGINT PRIMARY KEY     NOT NULL REFERENCES opponents (id) ON DELETE CASCADE,
    linked_user_id     BIGINT                 NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    integration_status linked_opponent_status NOT NULL DEFAULT 'WAITING_FOR_CONFIRMATION'
);

CREATE TYPE final_result AS ENUM ('WIN', 'DEFEAT');

CREATE TABLE IF NOT EXISTS plays
(
    id            BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    board_game_id BIGINT       NOT NULL REFERENCES board_games (id) ON DELETE CASCADE,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),

    date          TIMESTAMP    NULL     DEFAULT NOW(),
    note          TEXT         NULL,
    final_result  final_result NULL
);

CREATE INDEX ON plays (board_game_id);

CREATE TABLE IF NOT EXISTS play_results
(
    play_id     BIGINT NOT NULL REFERENCES plays (id) ON DELETE CASCADE,
    opponent_id BIGINT NOT NULL REFERENCES opponents (id) ON DELETE CASCADE,
    position    INT    NULL,
    points      INT    NULL,

    CONSTRAINT UNIQUE_PLAY_RESULT_OPPONENT UNIQUE (play_id, opponent_id)
);

CREATE INDEX ON play_results (play_id);

CREATE TABLE IF NOT EXISTS tags
(
    id         BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    creator_id BIGINT       NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    name       VARCHAR(255) NOT NULL,

    CONSTRAINT UNIQUE_TAG UNIQUE (name, creator_id)
);

CREATE INDEX ON tags (creator_id);
CREATE INDEX ON tags (name);


CREATE TABLE IF NOT EXISTS play_tags
(
    play_id BIGINT NOT NULL REFERENCES plays (id) ON DELETE CASCADE,
    tag_id  BIGINT NOT NULL REFERENCES tags (id) ON DELETE CASCADE,

    CONSTRAINT UNIQUE_PLAY_TAG UNIQUE (play_id, tag_id)
);


CREATE TYPE notification_event_type AS ENUM ('PLAY_ADDED', 'PLAY_EDITED', 'PLAY_DELETED', 'OPPONENT_LINKED');

CREATE TABLE IF NOT EXISTS notifications
(
    id               BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    display_user_id  BIGINT                  NULL REFERENCES users (id) ON DELETE CASCADE,
    created_at       TIMESTAMP               NOT NULL DEFAULT NOW(),
    displayed_at     TIMESTAMP               NULL,
    event_type       notification_event_type NOT NULL,
    event_data       JSON                    NULL,
    possible_actions VARCHAR ARRAY           NOT NULL DEFAULT ARRAY []::VARCHAR[]
)
