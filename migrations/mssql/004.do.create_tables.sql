IF OBJECT_ID('lookup.contacts', 'U') IS NULL CREATE TABLE lookup.contacts
    (
        id uniqueidentifier NOT NULL DEFAULT newid(),
        match_type VARCHAR(100) NOT NULL,
        match_value VARCHAR(100) NOT NULL,
        match_receiver VARCHAR(MAX) NOT NULL,
        telecom NVARCHAR(MAX) NOT NULL,
        created DATETIME2 NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_updated DATETIME2 DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT ck_destination_match PRIMARY KEY (match_type, match_value)
    );