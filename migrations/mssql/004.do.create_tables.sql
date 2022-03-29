IF OBJECT_ID('lookup.contacts', 'U') IS NULL CREATE TABLE lookup.contacts
    (
        id uniqueidentifier NOT NULL DEFAULT newid(),
        match_type VARCHAR(100) NOT NULL,
        match_value VARCHAR(100) NOT NULL,
        match_receiver VARCHAR(MAX) NOT NULL,
        telecom NVARCHAR(MAX) NOT NULL,
        created DATETIMEOFFSET NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_updated DATETIMEOFFSET DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT ck_destination_match PRIMARY KEY (match_type, match_value)
    );

IF OBJECT_ID('access.tokens', 'U') IS NULL CREATE TABLE access.tokens
    (
        id uniqueidentifier PRIMARY KEY NOT NULL DEFAULT newid(),
        [name] VARCHAR(MAX) NOT NULL,
        email VARCHAR(MAX) NOT NULL,
        [hash] VARCHAR(MAX) NOT NULL,
        salt VARCHAR(MAX) NOT NULL,
        scopes NVARCHAR(MAX) NOT NULL,
        expires DATETIMEOFFSET NOT NULL,
        created DATETIMEOFFSET NOT NULL DEFAULT CURRENT_TIMESTAMP,
        last_updated DATETIMEOFFSET DEFAULT CURRENT_TIMESTAMP,
    );