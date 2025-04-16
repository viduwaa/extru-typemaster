CREATE TABLE IF NOT EXISTS mp_players (
    id SERIAL PRIMARY KEY,
    unique_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar TEXT,
    university VARCHAR(255),
    role VARCHAR(50),
    school_student BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mp_playersPublic (
    id SERIAL PRIMARY KEY,
    unique_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar TEXT,
    university VARCHAR(255),
    role VARCHAR(50),
    school_student BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mp_leaderboard (
    id SERIAL PRIMARY KEY,
    player_id VARCHAR(255) REFERENCES mp_players(unique_id),
    wpm INTEGER NOT NULL,
    accuracy DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS mp_leaderboardPublic (
    id SERIAL PRIMARY KEY,
    player_id VARCHAR(255) REFERENCES mp_players(unique_id),
    wpm INTEGER NOT NULL,
    accuracy DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Index for faster leaderboard queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_wpm ON mp_leaderboard(wpm DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboardPublic_wpm ON mp_leaderboardPublic(wpm DESC);