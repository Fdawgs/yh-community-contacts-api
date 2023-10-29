"use strict";

const secJSON = require("secure-json-parse");

// Import plugins
const cors = require("@fastify/cors");

// Import utils
const escSq = require("../../utils/escape-single-quotes");

const {
	contactDeleteSchema,
	contactGetReadSchema,
	contactGetSearchSchema,
	contactPostSchema,
	contactPutSchema,
} = require("./schema");
const {
	contactDelete,
	contactGetRead,
	contactGetSearch,
	contactPost,
	contactPut,
} = require("./query");

// Cache immutable regex as they are expensive to create and garbage collect
const sqlLikePercRegex = /%/gu;
const sqlLikeUnderRegex = /_/gu;
const sqlLikeWildRegex = /\*/gu;

/**
 * @author Frazer Smith
 * @description Builds contact object from database results.
 * @param {object} results - Database query result.
 * @param {string} results.id - Unique identifier of community contact record.
 * @param {string} results.match_type - Type of matching value.
 * @param {string} results.match_value - Matching value.
 * @param {string} results.match_receiver - Receiving organisation or area.
 * @param {string} results.telecom - Stringified JSON object containing telecom details.
 * @param {string} results.created - Date community contact record was created.
 * @param {string} [results.last_updated] - Date community contact record was last updated.
 * @param {object} [req] - Fastify Request object.
 * @returns {object} community contact record.
 */
function buildContact(results, req) {
	return {
		// cleanObject will remove the undefined url key if present
		url:
			req !== undefined
				? new URL(
						`/contact/${results.id}`,
						`${req.protocol}://${req.hostname}`
				  ).href
				: undefined,
		id: results.id,
		match: {
			type: results.match_type,
			value: results.match_value,
			receiver: results.match_receiver,
		},
		/**
		 * Database client packages return results in different structures:
		 * mssql returns JSON as string; pg returns JSON as object
		 */
		telecom:
			typeof results.telecom === "string"
				? secJSON.parse(results.telecom)
				: results.telecom,
		meta: {
			created: results.created,
			last_updated: results.last_updated,
		},
	};
}

/**
 * @author Frazer Smith
 * @description Sets routing options for server.
 * @param {import("fastify").FastifyInstance} server - Fastify instance.
 * @param {object} options - Route config values.
 * @param {boolean} [options.bearerTokenAuthEnabled] - Apply `bearerToken` security scheme to route if defined.
 * @param {object} options.cors - CORS settings.
 * @param {object} options.database - Database config values.
 * @param {('mssql'|'postgresql')} options.database.client - Database client.
 */
async function route(server, options) {
	if (options.bearerTokenAuthEnabled) {
		const security = [{ bearerToken: [] }];
		const unauthRef = {
			$ref: "responses#/properties/unauthorized",
			description: "Unauthorized",
		};

		contactDeleteSchema.security = security;
		contactDeleteSchema.response[401] = unauthRef;

		contactGetReadSchema.security = security;
		contactGetReadSchema.response[401] = unauthRef;

		contactGetSearchSchema.security = security;
		contactGetSearchSchema.response[401] = unauthRef;

		contactPostSchema.security = security;
		contactPostSchema.response[401] = unauthRef;

		contactPutSchema.security = security;
		contactPutSchema.response[401] = unauthRef;
	}

	// Register plugins
	await server
		// Enable CORS if options passed
		.register(cors, {
			...options.cors,
			methods: ["DELETE", "GET", "HEAD", "POST", "PUT"],
		});

	server.route({
		method: "DELETE",
		url: "/:id",
		schema: contactDeleteSchema,
		preValidation: async (req) => {
			if (
				options.bearerTokenAuthEnabled &&
				!req.scopes?.includes("contact.delete")
			) {
				throw server.httpErrors.unauthorized(
					"You do not have permission to perform an HTTP DELETE request on this route"
				);
			}
		},
		handler: async (req, res) => {
			try {
				const results = await server.db.query(
					contactDelete({
						id: req.params.id,
					})
				);

				/**
				 * Database client packages return results in different structures,
				 * (mssql uses rowsAffected, pg uses rowCount) thus the optional chaining
				 */
				if (results.rowsAffected?.[0] > 0 || results.rowCount > 0) {
					return res.status(204).send();
				}
				return res.notFound(
					"Contact record does not exist or has already been deleted"
				);
			} catch (err) {
				return res.internalServerError(err.message);
			}
		},
	});

	server.route({
		method: "GET",
		url: "/:id",
		schema: contactGetReadSchema,
		preValidation: async (req) => {
			if (
				options.bearerTokenAuthEnabled &&
				!req.scopes?.includes("contact.read")
			) {
				throw server.httpErrors.unauthorized(
					"You do not have permission to perform an HTTP GET request on this route"
				);
			}
		},
		handler: async (req, res) => {
			try {
				const results = await server.db.query(
					contactGetRead({
						id: req.params.id,
					})
				);

				/**
				 * Database client packages return results in different structures,
				 * (mssql uses recordsets, pg uses rows) thus the optional chaining
				 */
				const contact = results.recordsets?.[0] ?? results.rows;

				if (contact?.length > 0) {
					return server.cleanObject(buildContact(contact[0]));
				}
				return res.notFound("Contact record not found");
			} catch (err) {
				return res.internalServerError(err.message);
			}
		},
	});

	server.route({
		method: "GET",
		url: "/",
		schema: contactGetSearchSchema,
		preValidation: async (req) => {
			if (
				options.bearerTokenAuthEnabled &&
				!req.scopes?.includes("contact.search")
			) {
				throw server.httpErrors.unauthorized(
					"You do not have permission to perform an HTTP GET request on this route"
				);
			}
		},
		handler: async (req, res) => {
			try {
				// Build WHERE clause
				const whereArray = [];

				// match.type - Type of matching value
				if (req.query?.["match.type"]) {
					whereArray.push(
						escSq`(match_type = '${req.query["match.type"]}')`
					);
				}

				// match.value - Matching value, case-insensitive and supports `*` wildcards
				if (req.query?.["match.value"]) {
					// _ and % act as wildcards in SQL LIKE clauses, so need to be escaped
					whereArray.push(
						escSq`(LOWER(match_value) LIKE LOWER('${req.query[
							"match.value"
						]
							.replace(sqlLikePercRegex, "!%")
							.replace(sqlLikeUnderRegex, "!_")
							.replace(sqlLikeWildRegex, "%")}') ESCAPE '!')`
					);
				}

				// match.receiver - Receiving organisation or area, case-insensitive and supports `*` wildcards
				if (req.query?.["match.receiver"]) {
					// _ and % act as wildcards in SQL LIKE clauses, so need to be escaped
					whereArray.push(
						escSq`(LOWER(match_receiver) LIKE LOWER('${req.query[
							"match.receiver"
						]
							.replace(sqlLikePercRegex, "!%")
							.replace(sqlLikeUnderRegex, "!_")
							.replace(sqlLikeWildRegex, "%")}') ESCAPE '!')`
					);
				}

				// telecom.value - Value of one of the objects `value` key in the telecom array
				if (req.query?.["telecom.value"]) {
					switch (options.database.client) {
						case "postgresql":
							whereArray.push(
								escSq`(EXISTS (SELECT * FROM jsonb_array_elements(lookup.contacts.telecom) AS x(o) WHERE x.o @> '{"value": "${req.query["telecom.value"]}"}'))`
							);
							break;

						case "mssql":
						default:
							whereArray.push(
								escSq`(ISJSON(telecom) = 1 AND JSON_VALUE(telecom_parsed.[value], '$.value') = '${req.query["telecom.value"]}')`
							);
							break;
					}
				}

				/**
				 * meta.created - Datetime when community contact record was created,
				 * can be a string or array
				 */
				if (req.query?.["meta.created"]) {
					const created = Array.isArray(req.query["meta.created"])
						? req.query["meta.created"]
						: [req.query["meta.created"]];

					created.forEach((createDate) => {
						let date = createDate;
						const operator = server.convertDateParamOperator(
							date.slice(0, 2)
						);

						if (Number.isNaN(Number(date.slice(0, 2)))) {
							date = date.slice(2);
						}

						whereArray.push(escSq`(created ${operator} '${date}')`);
					});
				}

				/**
				 * meta.last_updated - Last modified datetime of community contact record,
				 * can be a string or array
				 */
				if (req.query?.["meta.last_updated"]) {
					const lastUpdated = Array.isArray(
						req.query["meta.last_updated"]
					)
						? req.query["meta.last_updated"]
						: [req.query["meta.last_updated"]];

					lastUpdated.forEach((lastUpdatedDate) => {
						let date = lastUpdatedDate;
						const operator = server.convertDateParamOperator(
							date.slice(0, 2)
						);

						if (Number.isNaN(Number(date.slice(0, 2)))) {
							date = date.slice(2);
						}

						whereArray.push(
							escSq`(last_updated ${operator} '${date}')`
						);
					});
				}

				// Pagination values used for OFFSET and FETCH NEXT in SQL query
				const page = parseInt(req.query.page, 10) - 1;
				const perPage = parseInt(req.query.per_page, 10);

				/**
				 * Stops SQL query with empty WHERE clause from being made and throwing errors
				 * @todo replace with JSON Schema subschemas when supported
				 */
				if (whereArray.length === 0) {
					return res.badRequest(
						"No valid query string parameters provided"
					);
				}
				const whereClausePredicates = whereArray.join(" AND ");

				const results = await server.db.query(
					contactGetSearch({
						client: options.database.client,
						whereClausePredicates,
						page,
						perPage,
					})
				);

				/**
				 * Database client packages return results in different structures,
				 * (mssql uses recordsets, pg uses rows) thus the optional chaining
				 */
				const count =
					results.recordsets?.[0]?.[0]?.total ??
					results[0]?.rows?.[0]?.total ??
					0;
				const contacts = server.cleanObject(
					results.recordsets?.[1] ?? results[1]?.rows ?? []
				);

				const contactsObject = {
					link: new URL(req.url, `${req.protocol}://${req.hostname}`)
						.href,
					entry: contacts.map((contact) =>
						buildContact(contact, req)
					),
					meta: {
						pagination: {
							total: count,
							per_page: perPage,
							current_page: page + 1,
							total_pages: Math.ceil(count / perPage),
						},
					},
				};

				return server.cleanObject(contactsObject);
			} catch (err) {
				return res.internalServerError(err.message);
			}
		},
	});

	server.route({
		method: "POST",
		url: "/",
		schema: contactPostSchema,
		preValidation: async (req) => {
			if (
				options.bearerTokenAuthEnabled &&
				!req.scopes?.includes("contact.post")
			) {
				throw server.httpErrors.unauthorized(
					"You do not have permission to perform an HTTP POST request on this route"
				);
			}
		},
		handler: async (req, res) => {
			try {
				const results = await server.db.query(
					contactPost({
						client: options.database.client,
						matchType: req.body.match.type,
						matchValue: req.body.match.value,
						matchReceiver: req.body.match.receiver,
						telecom: JSON.stringify(req.body.telecom),
					})
				);

				/**
				 * Database client packages return results in different structures,
				 * (mssql uses recordsets, pg uses rows) thus the optional chaining
				 */
				let contact = results.recordsets?.[0] ?? results.rows;

				if (contact?.length > 0) {
					contact = contact[0];

					res.header(
						"location",
						new URL(
							`/contact/${contact.id}`,
							`${req.protocol}://${req.hostname}`
						).href
					).status(201);
					return contact;
				}

				throw new Error("Failed to create contact record");
			} catch (err) {
				// Primary key constraint 'ck_destination_match'
				if (err.message.includes("ck_destination_match")) {
					return res.badRequest(
						"A contact record with this match.type and match.value combination already exists"
					);
				}

				return res.internalServerError(err.message);
			}
		},
	});

	server.route({
		method: "PUT",
		url: "/:id",
		schema: contactPutSchema,
		preValidation: async (req) => {
			if (
				options.bearerTokenAuthEnabled &&
				!req.scopes?.includes("contact.put")
			) {
				throw server.httpErrors.unauthorized(
					"You do not have permission to perform an HTTP PUT request on this route"
				);
			}
		},
		handler: async (req, res) => {
			try {
				const results = await server.db.query(
					contactPut({
						id: req.params.id,
						matchType: req.body.match.type,
						matchValue: req.body.match.value,
						matchReceiver: req.body.match.receiver,
						telecom: JSON.stringify(req.body.telecom),
					})
				);

				/**
				 * Database client packages return results in different structures,
				 * (mssql uses rowsAffected, pg uses rowCount) thus the optional chaining
				 */
				if (results.rowsAffected?.[0] > 0 || results.rowCount > 0) {
					return res.status(204).send();
				}
				return res.notFound(
					"Contact record does not exist or has already been deleted"
				);
			} catch (err) {
				// Primary key constraint 'ck_destination_match'
				if (err.message.includes("ck_destination_match")) {
					return res.badRequest(
						"A contact record with this match.type and match.value combination already exists"
					);
				}

				return res.internalServerError(err.message);
			}
		},
	});
}

module.exports = route;
