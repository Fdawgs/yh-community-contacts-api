"use strict";

const escSq = require("../../utils/escape-single-quotes");

/**
 * @author Frazer Smith
 * @description Builds SQL query string.
 * @param {object} options - Query string and database config values.
 * @param {string} options.id - Logical id of the artifact.
 * @returns {string} Query string.
 */
const contactDelete = ({ id }) => escSq`DELETE
 FROM lookup.contacts
 WHERE id = '${id}';`;

/**
 * @author Frazer Smith
 * @description Builds SQL query string.
 * @param {object} options - Query string and database config values.
 * @param {string} options.id - Logical id of the artifact.
 * @returns {string} Query string.
 */
const contactGetRead = ({ id }) => escSq`SELECT
    id,
    match_type,
    match_value,
    match_receiver,
    telecom,
    created,
    last_updated
FROM lookup.contacts
WHERE id = '${id}';`;

/**
 * @author Frazer Smith
 * @description Builds SQL query string.
 * @param {object} options - Query string and database config values.
 * @param {('mssql'|'postgresql')} options.client - Database client.
 * @param {string} options.whereClausePredicates - WHERE clause predicates.
 * @param {number} options.page - Page to retrieve.
 * @param {number} options.perPage - Number of bearer token records to return per page.
 * @returns {string} Query string.
 */

// DISTINCT SQL keyword needed as CROSS APPLY causes duplicates
const contactGetSearch = ({ client, whereClausePredicates, page, perPage }) => `
SELECT COUNT(DISTINCT id)${
	// Cast from string to int - https://node-postgres.com/features/types
	client === "postgresql" ? "::int" : ""
} AS total
FROM lookup.contacts
${
	client === "mssql"
		? "CROSS APPLY OPENJSON(lookup.contacts.telecom, '$') telecom_parsed"
		: ""
}
WHERE ${whereClausePredicates};

SELECT DISTINCT
    id,
    match_type,
    match_value,
    match_receiver,
    telecom,
    created,
    last_updated
FROM lookup.contacts
${
	client === "mssql"
		? "CROSS APPLY OPENJSON(lookup.contacts.telecom, '$') telecom_parsed"
		: ""
}
WHERE ${whereClausePredicates}
ORDER BY created ASC
OFFSET ${page * perPage} ROWS
FETCH NEXT ${perPage} ROWS ONLY;`;

/**
 * @author Frazer Smith
 * @description Builds SQL query string.
 * @param {object} options - Query string and database config values.
 * @param {('mssql'|'postgresql')} options.client - Database client.
 * @param {string} options.matchType - Type of matching value.
 * @param {string} options.matchValue - Matching Value.
 * @param {string} options.matchReceiver - Receiving organisation or area.
 * @param {string} options.telecom - JSON string containing contact details.
 * @returns {string} Query string.
 */
const contactPost = ({
	client,
	matchType,
	matchValue,
	matchReceiver,
	telecom,
}) =>
	escSq`INSERT INTO lookup.contacts (match_type, match_value, match_receiver, telecom)
    ${client === "mssql" ? "OUTPUT Inserted.id" : ""}
    VALUES  ('${matchType}', '${matchValue}', '${matchReceiver}', '${telecom}')
    ${client === "postgresql" ? "RETURNING id" : ""};`;

/**
 * @author Frazer Smith
 * @description Builds SQL query string.
 * @param {object} options - Query string and database config values.
 * @param {string} options.id - Logical id of the artifact.
 * @param {string} options.matchType - Type of matching value.
 * @param {string} options.matchValue - Matching Value.
 * @param {string} options.matchReceiver - Receiving organisation or area.
 * @param {string} options.telecom - JSON string containing contact details.
 * @returns {string} Query string.
 */
const contactPut = ({ id, matchType, matchValue, matchReceiver, telecom }) =>
	escSq`UPDATE lookup.contacts
    SET match_type = '${matchType}',
    match_value = '${matchValue}',
    match_receiver = '${matchReceiver}',
    telecom = '${telecom}',
    last_updated = CURRENT_TIMESTAMP
    WHERE id = '${id}'`;

module.exports = {
	contactDelete,
	contactGetRead,
	contactGetSearch,
	contactPost,
	contactPut,
};
