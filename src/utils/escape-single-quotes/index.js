/* eslint-disable jsdoc/require-param-description -- Params are self-explanatory */

"use strict";

// Cache immutable regex as they are expensive to create and garbage collect
const quoteRegex = /'/gu;

/**
 * @author Frazer Smith
 * @description Tagged template function to replace single-quote characters
 * in string expressions with two adjacent single quotes, which allows
 * a single-quote character within a string constant in SQL.
 * @param {*} strings
 * @param  {...*} expressions
 * @returns {string} Template literal with single-quote characters replaced
 * with two adjacent single quotes in expressions.
 */
function escapeSingleQuote(strings, ...expressions) {
	const raw = strings;
	let result = "";

	expressions.forEach((value, i) => {
		result += raw[i];
		result +=
			typeof value === "string" ? value.replace(quoteRegex, "''") : value;
	});

	// Add last literal section
	result += raw[raw.length - 1];

	return result;
}

module.exports = escapeSingleQuote;
