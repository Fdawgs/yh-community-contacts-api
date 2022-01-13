CREATE SCHEMA IF NOT EXISTS lookup;

CREATE TABLE IF NOT EXISTS lookup.email_destinations
    (
        id UUID PRIMARY KEY NOT NULL DEFAULT GEN_RANDOM_UUID(),
        match_type VARCHAR(100) NOT NULL,
        match_value VARCHAR(100) NOT NULL,
        match_receiver VARCHAR NOT NULL,
        email_health_visitors VARCHAR(256),
        email_community_midwives VARCHAR(256),
        created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT ck_destination_match PRIMARY KEY (match_key, match_value)
    );