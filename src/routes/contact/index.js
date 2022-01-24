const { URL } = require("url");

// Import plugins
const cors = require("fastify-cors");

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

/**
 * @author Frazer Smith
 * @description Build contact object from database results.
 * @param {object} results - Database query result.
 * @param {string} results.id - Unique identifier of community contact record.
 * @param {string} results.match_type - Type of matching value.
 * @param {string} results.match_value - Matching value.
 * @param {string} results.match_receiver - Receiving organisation or area.
 * @param {string} results.telecom - Stringified JSON object containing telecom details.
 * @param {string} results.created - Date community contact record was created.
 * @param {string=} results.last_updated - Date community contact record was last updated.
 * @param {object=} req - Fastify Request object.
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
				? JSON.parse(results.telecom)
				: results.telecom,
		meta: {
			created: results.created,
			last_updated: results?.last_updated,
		},
	};
}

/**
 * @author Frazer Smith
 * @description Sets routing options for server.
 * @param {object} server - Fastify instance.
 * @param {object} options - Route config values.
 * @param {*=} options.bearerTokenAuthKeys - Apply `bearerToken` security scheme to route if defined.
 * @param {object} options.cors - CORS settings.
 * @param {object} options.database - Database config values.
 * @param {('mssql'|'postgresql')} options.database.client - Database client.
 */
async function route(server, options) {
	if (options.bearerTokenAuthKeys) {
		const security = [{ bearerToken: [] }];

		contactDeleteSchema.security = security;
		contactGetReadSchema.security = security;
		contactGetSearchSchema.security = security;
		contactPostSchema.security = security;
		contactPutSchema.security = security;
	}

	// Register plugins
	server
		// Use CORS: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
		.register(cors, {
			...options.cors,
			methods: ["DELETE", "GET", "POST", "PUT"],
		});

	server.route({
		method: "DELETE",
		url: "/:id",
		schema: contactDeleteSchema,
		async handler(req, res) {
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
				if (results?.rowsAffected?.[0] > 0 || results?.rowCount > 0) {
					res.status(204);
				} else {
					res.notFound(
						"Contact record does not exist or has already been deleted"
					);
				}
			} catch (err) {
				req.log.error({ req, res, err }, err && err.message);
				throw res.internalServerError(
					"Unable to delete contact record from database"
				);
			}
		},
	});

	server.route({
		method: "GET",
		url: "/:id",
		schema: contactGetReadSchema,
		async handler(req, res) {
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
				let contact = results?.recordsets?.[0] ?? results?.rows;

				if (contact && contact.length > 0) {
					contact = contact[0];

					res.send(server.cleanObject(buildContact(contact)));
				} else {
					res.notFound("Contact record(s) not found");
				}
			} catch (err) {
				req.log.error({ req, res, err }, err && err.message);
				throw res.internalServerError(
					"Unable to return result(s) from database"
				);
			}
		},
	});

	server.route({
		method: "GET",
		url: "/",
		schema: contactGetSearchSchema,
		async handler(req, res) {
			try {
				// Build WHERE clause
				const whereArray = [];

				// match.type - Type of matching value
				if (req?.query?.["match.type"]) {
					whereArray.push(
						`(match_type = '${req.query["match.type"]}')`
					);
				}

				// match.value - Matching value, supports `*` wildcards
				if (req?.query?.["match.value"]) {
					// _ and % act as wildcards in SQL LIKE clauses, so need to be escaped
					whereArray.push(
						`(match_value LIKE '${req.query["match.value"]
							.replace(/%/g, "!%")
							.replace(/_/g, "!_")
							.replace(/\*/g, "%")}' ESCAPE '!')`
					);
				}

				// match.receiver - Receiving organisation or area
				if (req?.query?.["match.receiver"]) {
					whereArray.push(
						`(match_receiver = '${req.query["match.receiver"]}')`
					);
				}

				// telecom.value - Value of one of the objects `value` key in the telecom array
				if (req?.query?.["telecom.value"]) {
					switch (options.database.client) {
						case "postgresql":
							whereArray.push(
								`(EXISTS (SELECT * FROM jsonb_array_elements(lookup.contacts.telecom) AS x(o) WHERE x.o @> '{"value": "${req.query["telecom.value"]}"}'))`
							);
							break;

						case "mssql":
						default:
							whereArray.push(
								`(ISJSON(telecom) = 1 AND JSON_VALUE(telecom_parsed.[value], '$.value') = '${req.query["telecom.value"]}')`
							);
							break;
					}
				}

				/**
				 * meta.created - Datetime when community contact record was created,
				 * can be a string or array
				 */
				if (req?.query?.["meta.created"]) {
					let created = [];
					if (Array.isArray(req.query["meta.created"])) {
						created = req.query["meta.created"];
					} else {
						created.push(req.query["meta.created"]);
					}

					created.forEach((createDate) => {
						let date = createDate;
						const operator = server.convertDateParamOperator(
							date.substring(0, 2)
						);

						if (Number.isNaN(Number(date.substring(0, 2)))) {
							date = date.substring(2, date.length);
						}

						whereArray.push(`(created ${operator} '${date}')`);
					});
				}

				/**
				 * meta.last_updated - Last modified datetime of community contact record,
				 * can be a string or array
				 */
				if (req?.query?.["meta.last_updated"]) {
					let lastUpdated = [];
					if (Array.isArray(req.query["meta.last_updated"])) {
						lastUpdated = req.query["meta.last_updated"];
					} else {
						lastUpdated.push(req.query["meta.last_updated"]);
					}

					lastUpdated.forEach((lastUpdatedDate) => {
						let date = lastUpdatedDate;
						const operator = server.convertDateParamOperator(
							date.substring(0, 2)
						);

						if (Number.isNaN(Number(date.substring(0, 2)))) {
							date = date.substring(2, date.length);
						}

						whereArray.push(`(last_updated ${operator} '${date}')`);
					});
				}

				// Pagination values used for OFFSET and FETCH NEXT in SQL query
				const page = parseInt(req.query.page, 10) - 1;
				const perPage = parseInt(req.query.per_page, 10);

				// Stops SQL query with empty WHERE clause from being made and throwing errors
				// TODO: replace with JSON Schema subschemas when supported
				if (whereArray.length === 0) {
					res.badRequest("No valid query string parameters provided");
				} else {
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
						results?.recordsets?.[0]?.[0]?.total ??
						results?.[0]?.rows?.[0]?.total ??
						0;
					const contacts = server.cleanObject(
						results?.recordsets?.[1] ?? results?.[1]?.rows ?? []
					);

					const contactsObject = {
						link: new URL(
							req.url,
							`${req.protocol}://${req.hostname}`
						).href,
						entry: [],
						meta: {
							pagination: {
								total: count,
								per_page: perPage,
								current_page: page + 1,
								total_pages: Math.ceil(count / perPage),
							},
						},
					};

					contacts.forEach((contact) => {
						contactsObject.entry.push(buildContact(contact, req));
					});
					res.send(server.cleanObject(contactsObject));
				}
			} catch (err) {
				req.log.error({ req, res, err }, err && err.message);
				throw res.internalServerError(
					"Unable to return result(s) from database"
				);
			}
		},
	});

	server.route({
		method: "POST",
		url: "/",
		schema: contactPostSchema,
		async handler(req, res) {
			try {
				const results = await server.db.query(
					contactPost({
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
				if (results?.rowsAffected?.[0] > 0 || results?.rowCount > 0) {
					res.status(204);
				} else {
					res.notFound(
						"Contact record does not exist or has already been deleted"
					);
				}
			} catch (err) {
				req.log.error({ req, res, err }, err && err.message);
				// Primary key constraint 'ck_destination_match'
				throw res.internalServerError(
					err.message.includes("ck_destination_match")
						? "A contact record with this match.type and match.value combination already exists"
						: "Unable to add contact record to database"
				);
			}
		},
	});

	server.route({
		method: "PUT",
		url: "/:id",
		schema: contactPutSchema,
		async handler(req, res) {
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
				if (results?.rowsAffected?.[0] > 0 || results?.rowCount > 0) {
					res.status(204);
				} else {
					res.notFound(
						"Contact record does not exist or has already been deleted"
					);
				}
			} catch (err) {
				req.log.error({ req, res, err }, err && err.message);
				// Primary key constraint 'ck_destination_match'
				throw res.internalServerError(
					err.message.includes("ck_destination_match")
						? "A contact record with this match.type and match.value combination already exists"
						: "Unable to update contact record in database"
				);
			}
		},
	});
}

module.exports = route;
