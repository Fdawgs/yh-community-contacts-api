const S = require("fluent-json-schema");

const tags = ["Community Contacts"];

/**
 * Fastify uses AJV for JSON Schema Validation,
 * see https://www.fastify.io/docs/latest/Validation-and-Serialization/
 *
 * Input validation protects against XSS, HPP, and most injection attacks.
 */
const contactDeleteSchema = {
	tags,
	summary: "Delete community contact",
	description: "Delete a community contact record.",
	operationId: "deleteContact",
	params: S.object()
		.prop(
			"id",
			S.string()
				.description("Unique identifier of community contact record")
				.examples(["A972C577-DFB0-064E-1189-0154C99310DAAC12"])
				.format("uuid")
		)
		.required(["id"]),
	response: {
		204: S.string().raw({ nullable: true }).description("No Content"),
		401: S.ref("responses#/definitions/unauthorized").description(
			"Unauthorized"
		),
		404: S.ref("responses#/definitions/notFoundDbResults").description(
			"Not Found"
		),
		406: S.ref("responses#/definitions/notAcceptable").description(
			"Not Acceptable"
		),
		429: S.ref("responses#/definitions/tooManyRequests").description(
			"Too Many Requests"
		),
		500: S.ref("responses#/definitions/internalServerError").description(
			"Internal Server Error"
		),
		503: S.ref("responses#/definitions/serviceUnavailable").description(
			"Service Unavailable"
		),
	},
};

const contactGetReadSchema = {
	tags,
	summary: "Read community contact",
	description: "Return a single community contact record.",
	operationId: "getReadContact",
	produces: ["application/json"],
	params: S.object()
		.prop(
			"id",
			S.string()
				.description("Unique identifier of community contact record")
				.examples(["A972C577-DFB0-064E-1189-0154C99310DAAC12"])
				.format("uuid")
		)
		.required(["id"]),
	response: {
		200: S.object()
			.prop("id", S.string().format("uuid"))
			.prop(
				"match",
				S.object()
					.prop(
						"type",
						S.string().examples([
							"gp_id",
							"postcode",
							"school code",
						])
					)
					.prop("value", S.string().examples(["BA229RZ"]))
					.prop("receiver", S.string().examples(["Sherborne"]))
			)
			.prop(
				"telecom",
				S.array()
					.items(
						S.object()
							.prop("system", S.string().examples(["email"]))
							.prop(
								"value",
								S.string().examples(["example@ydh.nhs.uk"])
							)
							.prop(
								"use",
								S.string().examples([
									"Community Midwives",
									"Health Visitors",
								])
							)
					)
					.uniqueItems(true)
			)
			.prop(
				"meta",
				S.object()
					.prop(
						"created",
						S.string()
							.examples(["2022-01-13T14:05:54.000Z"])
							.format("date-time")
					)
					.prop(
						"last_updated",
						S.string()
							.examples(["2022-01-13T14:05:54.000Z"])
							.format("date-time")
					)
			),
		401: S.ref("responses#/definitions/unauthorized").description(
			"Unauthorized"
		),
		404: S.ref("responses#/definitions/notFoundDbResults").description(
			"Not Found"
		),
		406: S.ref("responses#/definitions/notAcceptable").description(
			"Not Acceptable"
		),
		429: S.ref("responses#/definitions/tooManyRequests").description(
			"Too Many Requests"
		),
		500: S.ref("responses#/definitions/internalServerError").description(
			"Internal Server Error"
		),
		503: S.ref("responses#/definitions/serviceUnavailable").description(
			"Service Unavailable"
		),
	},
};

// TODO: add 200 response
const contactGetSearchSchema = {
	tags,
	summary: "Search community contact",
	description: "Return community contact records.",
	operationId: "getSearchContact",
	produces: ["application/json"],
	responses: {
		401: S.ref("responses#/definitions/unauthorized").description(
			"Unauthorized"
		),
		404: S.ref("responses#/definitions/notFoundDbResults").description(
			"Not Found"
		),
		406: S.ref("responses#/definitions/notAcceptable").description(
			"Not Acceptable"
		),
		429: S.ref("responses#/definitions/tooManyRequests").description(
			"Too Many Requests"
		),
		500: S.ref("responses#/definitions/internalServerError").description(
			"Internal Server Error"
		),
		503: S.ref("responses#/definitions/serviceUnavailable").description(
			"Service Unavailable"
		),
	},
};

const contactPostSchema = {
	tags,
	summary: "Add community contact",
	description: "Add a new community contact record.",
	operationId: "postContact",
	body: S.object()
		.prop(
			"match",
			S.object()
				.prop(
					"type",
					S.string().examples(["gp_id", "postcode", "school code"])
				)
				.prop("value", S.string().examples(["BA229RZ"]))
				.prop("receiver", S.string().examples(["Sherborne"]))
				.required("type", "value", "receiver")
		)
		.prop(
			"telecom",
			S.array()
				.items(
					S.object()
						.prop("system", S.string().examples(["email"]))
						.prop(
							"value",
							S.string().examples(["example@ydh.nhs.uk"])
						)
						.prop(
							"use",
							S.string().examples([
								"Community Midwives",
								"Health Visitors",
							])
						)
						.required("system", "value", "use")
				)
				.minItems(1)
				.uniqueItems(true)
		)
		.required(["match", "telecom"]),
	response: {
		204: S.string().raw({ nullable: true }).description("No Content"),
		401: S.ref("responses#/definitions/unauthorized").description(
			"Unauthorized"
		),
		406: S.ref("responses#/definitions/notAcceptable").description(
			"Not Acceptable"
		),
		429: S.ref("responses#/definitions/tooManyRequests").description(
			"Too Many Requests"
		),
		500: S.ref("responses#/definitions/internalServerError").description(
			"Internal Server Error"
		),
		503: S.ref("responses#/definitions/serviceUnavailable").description(
			"Service Unavailable"
		),
	},
};

// TODO: add body and responses
const contactPutSchema = {
	tags,
	summary: "Update community contact",
	description: "Update an existing community contact record.",
	operationId: "putContact",
	params: S.object()
		.prop(
			"id",
			S.string()
				.description("Unique identifier of community contact record")
				.examples(["A972C577-DFB0-064E-1189-0154C99310DAAC12"])
				.format("uuid")
		)
		.required(["id"]),
};

module.exports = {
	contactDeleteSchema,
	contactGetReadSchema,
	contactGetSearchSchema,
	contactPostSchema,
	contactPutSchema,
};
