CREATE SCHEMA IF NOT EXISTS lookup;

CREATE SCHEMA IF NOT EXISTS access;

CREATE TABLE IF NOT EXISTS lookup.contacts
    (
        id UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
        match_type VARCHAR(100) NOT NULL,
        match_value VARCHAR(100) NOT NULL,
        match_receiver VARCHAR NOT NULL,
        telecom JSONB NOT NULL,
        created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT ck_destination_match PRIMARY KEY (match_type, match_value)
    );

CREATE TABLE IF NOT EXISTS access.tokens
    (
        id UUID PRIMARY KEY NOT NULL DEFAULT GEN_RANDOM_UUID(),
        name VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        hash VARCHAR NOT NULL,
        scopes JSONB NOT NULL,
        expires TIMESTAMPTZ NOT NULL,
        created TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );