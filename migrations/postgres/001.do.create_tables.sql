CREATE SCHEMA IF NOT EXISTS lookup;

CREATE TABLE IF NOT EXISTS lookup.discharge_email_destinations
    (
        match_key VARCHAR(100) NOT NULL,
        match_value VARCHAR(100) NOT NULL,
        receiver VARCHAR NOT NULL,
        email_health_visitors VARCHAR(256) NOT NULL,
        email_community_midwives VARCHAR(256) NOT NULL,
        created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT ck_destination_match PRIMARY KEY (match_key, match_value)
    );