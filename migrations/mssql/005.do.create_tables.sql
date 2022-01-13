IF OBJECT_ID('community_contacts_api.lookup.discharge_email_destinations', 'U') IS NULL CREATE TABLE community_contacts_api.lookup.email_destinations
    (
        id uniqueidentifier NOT NULL DEFAULT newid(),
        match_type VARCHAR(100) NOT NULL,
        match_value VARCHAR(100) NOT NULL,
        match_receiver VARCHAR(MAX) NOT NULL,
        email_health_visitors VARCHAR(256),
        email_community_midwives VARCHAR(256),
        created DATETIME2 NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_updated DATETIME2 DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT ck_destination_match PRIMARY KEY (match_key, match_value)
    );