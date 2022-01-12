IF OBJECT_ID('community_contacts_api.lookup.discharge_email_destinations', 'U') IS NULL CREATE TABLE community_contacts_api.lookup.discharge_email_destinations
    (
        match_key VARCHAR(100) NOT NULL,
        match_value VARCHAR(100) NOT NULL,
        receiver VARCHAR(MAX) NOT NULL,
        email_health_visitors VARCHAR(256) NOT NULL,
        email_community_midwives VARCHAR(256) NOT NULL,
        created DATETIME NOT NULL,
        last_updated DATETIME,
        CONSTRAINT ck_destination_match PRIMARY KEY (match_key, match_value)
    );