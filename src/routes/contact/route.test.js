const Fastify = require("fastify");
const sensible = require("@fastify/sensible");
const route = require(".");
const getConfig = require("../../config");
const cleanObject = require("../../plugins/clean-object");
const convertDateParamOperator = require("../../plugins/convert-date-param-operator");
const sharedSchemas = require("../../plugins/shared-schemas");

const testPage = 1;

const testDate1 = "2018-08-01";
const testDate2 = "2022-11-07";

const testId = "b8e7265c-4733-44be-9238-7d7b8718fb88";
const testReqBody = {
	match: {
		type: "postcode",
		value: "TA126JU",
		receiver: "Area North",
	},
	telecom: [
		{
			system: "email",
			value: "examplehv@nhs.net",
			use: "Health Visitors",
		},
		{
			system: "email",
			value: "examplemidwife@somersetft.nhs.uk",
			use: "Community Midwives",
		},
	],
};

const testDbResult = {
	id: testId,
	match_type: testReqBody.match.type,
	match_value: testReqBody.match.value,
	match_receiver: testReqBody.match.receiver,
	created: "2022-01-18T14:07:48.190Z",
	last_updated: "2022-01-18T14:07:48.190Z",
};

const expSearchResult = {
	link: expect.any(String),
	meta: {
		pagination: {
			total: expect.any(Number),
			per_page: testPage,
			current_page: testPage,
			total_pages: expect.any(Number),
		},
	},
	entry: [
		{
			url: `http://localhost/contact/${testId}`,
			id: testId,
			meta: {
				created: testDbResult.created,
				last_updated: testDbResult.last_updated,
			},
			...testReqBody,
		},
	],
};

describe("Contact route", () => {
	const connectionTests = [
		{
			testName: "MSSQL connection",
			envVariables: {
				DB_CLIENT: "mssql",
			},
			mocks: {
				queryResults: {
					delete: {
						error: { rowsAffected: [0] },
						ok: { rowsAffected: [1] },
					},
					getRead: {
						error: {
							recordsets: [],
						},
						ok: {
							recordsets: [
								[
									{
										...testDbResult,
										telecom: JSON.stringify(
											testReqBody.telecom
										),
									},
								],
							],
						},
					},
					getSearch: {
						error: {
							recordsets: [[], []],
						},
						ok: {
							recordsets: [
								[{ total: 1 }],
								[
									{
										...testDbResult,
										telecom: JSON.stringify(
											testReqBody.telecom
										),
									},
								],
							],
						},
					},
					post: {
						error: {
							recordsets: [],
						},
						ok: {
							recordsets: [
								[
									{
										id: testId,
									},
								],
							],
						},
					},
					put: {
						error: {
							rowsAffected: [0],
						},
						ok: {
							rowsAffected: [1],
						},
					},
				},
			},
		},
		{
			testName: "PostgreSQL connection",
			envVariables: {
				DB_CLIENT: "postgresql",
			},
			mocks: {
				queryResults: {
					delete: {
						error: { rowCount: 0 },
						ok: { rowCount: 1 },
					},
					getRead: {
						error: {
							rows: [],
						},
						ok: {
							rows: [
								{
									...testDbResult,
									telecom: testReqBody.telecom,
								},
							],
						},
					},
					getSearch: {
						error: {
							rows: [],
						},
						ok: [
							{ rows: [{ total: 1 }] },
							{
								rows: [
									{
										...testDbResult,
										telecom: testReqBody.telecom,
									},
								],
							},
						],
					},
					post: {
						error: {
							rows: [],
						},
						ok: {
							rows: [
								{
									id: testId,
								},
							],
						},
					},
					put: { error: { rowCount: 0 }, ok: { rowCount: 1 } },
				},
			},
		},
	];
	connectionTests.forEach((testObject) => {
		describe(`${testObject.testName} - with request scopes`, () => {
			let config;
			let server;

			beforeAll(async () => {
				Object.assign(process.env, {
					BEARER_TOKEN_AUTH_ENABLED: true,
					...testObject.envVariables,
				});
				config = await getConfig();

				server = Fastify();
				await server
					.register(cleanObject)
					.register(convertDateParamOperator)
					.decorateRequest("scopes", null)
					.addHook("preValidation", async (req) => {
						req.scopes = [
							"contact.read",
							"contact.search",
							"contact.delete",
							"contact.post",
							"contact.put",
						];
					})
					.register(sensible)
					.register(sharedSchemas)
					.register(route, config)
					.ready();
			});

			afterAll(async () => {
				await server.close();
			});

			describe("/:id DELETE requests", () => {
				it("Deletes a contact record", async () => {
					const mockQueryFn = jest
						.fn()
						.mockResolvedValue(
							testObject.mocks.queryResults.delete.ok
						);

					server.db = {
						query: mockQueryFn,
					};

					const response = await server.inject({
						method: "DELETE",
						url: `/${testId}`,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(response.body).toBe("");
					expect(response.statusCode).toBe(204);
				});

				it("Returns HTTP status code 404 if contact record missing or already deleted", async () => {
					const mockQueryFn = jest
						.fn()
						.mockResolvedValue(
							testObject.mocks.queryResults.delete.error
						);

					server.db = {
						query: mockQueryFn,
					};

					const response = await server.inject({
						method: "DELETE",
						url: `/${testId}`,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.body)).toStrictEqual({
						error: "Not Found",
						message:
							"Contact record does not exist or has already been deleted",
						statusCode: 404,
					});
					expect(response.statusCode).toBe(404);
				});

				it("Returns HTTP status code 500 if connection issue encountered", async () => {
					const mockQueryFn = jest
						.fn()
						.mockRejectedValue(Error("Failed to connect to DB"));

					server.db = {
						query: mockQueryFn,
					};

					const response = await server.inject({
						method: "DELETE",
						url: `/${testId}`,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.body)).toStrictEqual({
						error: "Internal Server Error",
						message: "Failed to connect to DB",
						statusCode: 500,
					});
					expect(response.statusCode).toBe(500);
				});
			});

			describe("/:id GET requests", () => {
				it("Returns contact record", async () => {
					const mockQueryFn = jest
						.fn()
						.mockResolvedValue(
							testObject.mocks.queryResults.getRead.ok
						);

					server.db = {
						query: mockQueryFn,
					};

					const response = await server.inject({
						method: "GET",
						url: `/${testId}`,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.body)).toStrictEqual({
						id: testId,
						meta: {
							created: "2022-01-18T14:07:48.190Z",
							last_updated: "2022-01-18T14:07:48.190Z",
						},
						...testReqBody,
					});
					expect(response.statusCode).toBe(200);
				});

				it("Returns HTTP status code 404 if contact record missing", async () => {
					const mockQueryFn = jest
						.fn()
						.mockResolvedValue(
							testObject.mocks.queryResults.getRead.error
						);

					server.db = {
						query: mockQueryFn,
					};

					const response = await server.inject({
						method: "GET",
						url: `/${testId}`,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.body)).toStrictEqual({
						error: "Not Found",
						message: "Contact record not found",
						statusCode: 404,
					});
					expect(response.statusCode).toBe(404);
				});

				it("Returns HTTP status code 500 if connection issue encountered", async () => {
					const mockQueryFn = jest
						.fn()
						.mockRejectedValue(Error("Failed to connect to DB"));

					server.db = {
						query: mockQueryFn,
					};

					const response = await server.inject({
						method: "GET",
						url: `/${testId}`,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.body)).toStrictEqual({
						error: "Internal Server Error",
						message: "Failed to connect to DB",
						statusCode: 500,
					});
					expect(response.statusCode).toBe(500);
				});
			});

			describe("/ GET requests", () => {
				it("Returns contact record, using all query string parameters", async () => {
					const mockQueryFn = jest
						.fn()
						.mockResolvedValue(
							testObject.mocks.queryResults.getSearch.ok
						);

					server.db = {
						query: mockQueryFn,
					};

					const response = await server.inject({
						method: "GET",
						url: "/",
						query: {
							"match.type": testDbResult.match_type,
							"match.value": testDbResult.match_value,
							"match.receiver": testDbResult.match_receiver,
							"telecom.value": testReqBody.telecom[0].value,
							"meta.created": testDate1,
							"meta.last_updated": testDate1,
							per_page: testPage,
							page: testPage,
						},
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.body)).toStrictEqual(
						expSearchResult
					);
					expect(response.statusCode).toBe(200);
				});

				it("Returns contact record, using more than one `meta.created` and `meta.last_updated` query string params", async () => {
					const mockQueryFn = jest
						.fn()
						.mockResolvedValue(
							testObject.mocks.queryResults.getSearch.ok
						);

					server.db = {
						query: mockQueryFn,
					};

					const response = await server.inject({
						method: "GET",
						url: "/",
						query: {
							"meta.created": [testDate1, testDate2],
							"meta.last_updated": [testDate1, testDate2],
						},
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.body)).toStrictEqual(
						expSearchResult
					);
					expect(response.statusCode).toBe(200);
				});

				it("Returns contact record, using operators in the `meta.created` and `meta.last_updated` query string params", async () => {
					const mockQueryFn = jest
						.fn()
						.mockResolvedValue(
							testObject.mocks.queryResults.getSearch.ok
						);

					server.db = {
						query: mockQueryFn,
					};

					const response = await server.inject({
						method: "GET",
						url: "/",
						query: {
							"meta.created": `ge${testDate1}`,
							"meta.last_updated": `ge${testDate1}`,
						},
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.body)).toStrictEqual(
						expSearchResult
					);
					expect(response.statusCode).toBe(200);
				});

				it("Returns no contact records if table empty", async () => {
					const mockQueryFn = jest.fn().mockResolvedValue({});

					server.db = {
						query: mockQueryFn,
					};

					const response = await server.inject({
						method: "GET",
						url: "/",
						query: {
							"match.type": testDbResult.match_type,
						},
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.body)).toStrictEqual({
						link: expect.any(String),
						meta: {
							pagination: {
								total: 0,
								per_page: testPage,
								current_page: testPage,
								total_pages: 0,
							},
						},
						entry: [],
					});
					expect(response.statusCode).toBe(200);
				});

				it("Returns HTTP status code 400 if no query string params present", async () => {
					const mockQueryFn = jest
						.fn()
						.mockResolvedValue(
							testObject.mocks.queryResults.getSearch.error
						);

					server.db = {
						query: mockQueryFn,
					};

					const response = await server.inject({
						method: "GET",
						url: "/",
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(0);
					expect(JSON.parse(response.body)).toStrictEqual({
						error: "Bad Request",
						message: "No valid query string parameters provided",
						statusCode: 400,
					});
					expect(response.statusCode).toBe(400);
				});

				it("Returns HTTP status code 500 if connection issue encountered", async () => {
					const mockQueryFn = jest
						.fn()
						.mockRejectedValue(Error("Failed to connect to DB"));

					server.db = {
						query: mockQueryFn,
					};

					const response = await server.inject({
						method: "GET",
						url: "/",
						query: {
							"match.type": testDbResult.match_type,
						},
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.body)).toStrictEqual({
						error: "Internal Server Error",
						message: "Failed to connect to DB",
						statusCode: 500,
					});
					expect(response.statusCode).toBe(500);
				});
			});

			describe("/:id PUT requests", () => {
				it("Updates contact record", async () => {
					const mockQueryFn = jest
						.fn()
						.mockResolvedValue(
							testObject.mocks.queryResults.put.ok
						);

					server.db = {
						query: mockQueryFn,
					};

					const response = await server.inject({
						method: "PUT",
						url: `/${testId}`,
						headers: {
							"content-type": "application/json",
						},
						body: testReqBody,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(response.body).toBe("");
					expect(response.statusCode).toBe(204);
				});

				it("Returns HTTP status code 415 if content-type in `Content-Type` request header unsupported", async () => {
					const mockQueryFn = jest
						.fn()
						.mockResolvedValue(
							testObject.mocks.queryResults.put.ok
						);

					server.db = {
						query: mockQueryFn,
					};

					const response = await server.inject({
						method: "PUT",
						url: `/${testId}`,
						headers: {
							"content-type": "application/javascript",
						},
						body: testReqBody,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(0);
					expect(JSON.parse(response.body)).toStrictEqual({
						error: "Unsupported Media Type",
						message:
							"Unsupported Media Type: application/javascript",
						statusCode: 415,
					});
					expect(response.statusCode).toBe(415);
				});

				it("Returns HTTP status code 404 if contact record with id not found", async () => {
					const mockQueryFn = jest
						.fn()
						.mockResolvedValue(
							testObject.mocks.queryResults.put.error
						);

					server.db = {
						query: mockQueryFn,
					};

					const response = await server.inject({
						method: "PUT",
						url: `/${testId}`,
						headers: {
							"content-type": "application/json",
						},
						body: testReqBody,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.body)).toStrictEqual({
						error: "Not Found",
						message:
							"Contact record does not exist or has already been deleted",
						statusCode: 404,
					});
					expect(response.statusCode).toBe(404);
				});

				it("Returns HTTP status code 500 if connection issue encountered", async () => {
					const mockQueryFn = jest
						.fn()
						.mockRejectedValue(Error("Failed to connect to DB"));

					server.db = {
						query: mockQueryFn,
					};

					const response = await server.inject({
						method: "PUT",
						url: `/${testId}`,
						headers: {
							"content-type": "application/json",
						},
						body: testReqBody,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.body)).toStrictEqual({
						error: "Internal Server Error",
						message: "Failed to connect to DB",
						statusCode: 500,
					});
					expect(response.statusCode).toBe(500);
				});

				it("Returns HTTP status code 500 if primary key constraint violation occurs", async () => {
					const mockQueryFn = jest
						.fn()
						.mockRejectedValue(Error("ck_destination_match"));

					server.db = {
						query: mockQueryFn,
					};

					const response = await server.inject({
						method: "PUT",
						url: `/${testId}`,
						headers: {
							"content-type": "application/json",
						},
						body: testReqBody,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.body)).toStrictEqual({
						error: "Bad Request",
						message:
							"A contact record with this match.type and match.value combination already exists",
						statusCode: 400,
					});
					expect(response.statusCode).toBe(400);
				});
			});

			describe("/ POST requests", () => {
				it("Creates contact record", async () => {
					const mockQueryFn = jest
						.fn()
						.mockResolvedValue(
							testObject.mocks.queryResults.post.ok
						);

					server.db = {
						query: mockQueryFn,
					};

					const response = await server.inject({
						method: "POST",
						url: "/",
						headers: {
							"content-type": "application/json",
						},
						body: testReqBody,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.body)).toStrictEqual({
						id: testId,
					});
					expect(response.headers).toMatchObject({
						location: expect.stringContaining(`/contact/${testId}`),
					});
					expect(response.statusCode).toBe(201);
				});

				it("Returns HTTP status code 415 if content-type in `Content-Type` request header unsupported", async () => {
					const mockQueryFn = jest
						.fn()
						.mockResolvedValue(
							testObject.mocks.queryResults.post.ok
						);

					server.db = {
						query: mockQueryFn,
					};

					const response = await server.inject({
						method: "POST",
						url: "/",
						headers: {
							"content-type": "application/javascript",
						},
						body: testReqBody,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(0);
					expect(JSON.parse(response.body)).toStrictEqual({
						error: "Unsupported Media Type",
						message:
							"Unsupported Media Type: application/javascript",
						statusCode: 415,
					});
					expect(response.statusCode).toBe(415);
				});

				it("Returns HTTP status code 500 if unable to create a contact record", async () => {
					const mockQueryFn = jest
						.fn()
						.mockResolvedValue(
							testObject.mocks.queryResults.post.error
						);

					server.db = {
						query: mockQueryFn,
					};

					const response = await server.inject({
						method: "POST",
						url: "/",
						headers: {
							"content-type": "application/json",
						},
						body: testReqBody,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.body)).toStrictEqual({
						error: "Internal Server Error",
						message: "Failed to create contact record",
						statusCode: 500,
					});
					expect(response.statusCode).toBe(500);
				});

				it("Returns HTTP status code 500 if connection issue encountered", async () => {
					const mockQueryFn = jest
						.fn()
						.mockRejectedValue(Error("Failed to connect to DB"));

					server.db = {
						query: mockQueryFn,
					};

					const response = await server.inject({
						method: "POST",
						url: "/",
						headers: {
							"content-type": "application/json",
						},
						body: testReqBody,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.body)).toStrictEqual({
						error: "Internal Server Error",
						message: "Failed to connect to DB",
						statusCode: 500,
					});
					expect(response.statusCode).toBe(500);
				});

				it("Returns HTTP status code 500 if primary key constraint violation occurs", async () => {
					const mockQueryFn = jest
						.fn()
						.mockRejectedValue(Error("ck_destination_match"));

					server.db = {
						query: mockQueryFn,
					};

					const response = await server.inject({
						method: "POST",
						url: "/",
						headers: {
							"content-type": "application/json",
						},
						body: testReqBody,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.body)).toStrictEqual({
						error: "Bad Request",
						message:
							"A contact record with this match.type and match.value combination already exists",
						statusCode: 400,
					});
					expect(response.statusCode).toBe(400);
				});
			});
		});

		describe(`${testObject.testName} - without request scopes`, () => {
			let config;
			let server;

			beforeAll(async () => {
				Object.assign(process.env, {
					BEARER_TOKEN_AUTH_ENABLED: true,
					...testObject.envVariables,
				});
				config = await getConfig();

				server = Fastify();
				await server
					.register(cleanObject)
					.register(convertDateParamOperator)
					.register(sensible)
					.register(sharedSchemas)
					.register(route, config)
					.ready();
			});

			afterAll(async () => {
				await server.close();
			});

			describe("/:id DELETE requests", () => {
				it("Returns HTTP status code 401 if not in permitted access", async () => {
					const response = await server.inject({
						method: "DELETE",
						url: `/${testId}`,
					});

					expect(JSON.parse(response.body)).toStrictEqual({
						error: "Unauthorized",
						message:
							"You do not have permission to perform an HTTP DELETE request on this route",
						statusCode: 401,
					});
					expect(response.statusCode).toBe(401);
				});
			});

			describe("/:id GET requests", () => {
				it("Returns HTTP status code 401 if not in permitted access", async () => {
					const response = await server.inject({
						method: "GET",
						url: `/${testId}`,
					});

					expect(JSON.parse(response.body)).toStrictEqual({
						error: "Unauthorized",
						message:
							"You do not have permission to perform an HTTP GET request on this route",
						statusCode: 401,
					});
					expect(response.statusCode).toBe(401);
				});
			});

			describe("/ GET requests", () => {
				it("Returns HTTP status code 401 if not in permitted access", async () => {
					const response = await server.inject({
						method: "GET",
						url: "/",
						query: {
							"match.type": testDbResult.match_type,
							"match.value": testDbResult.match_value,
							"match.receiver": testDbResult.match_receiver,
							"telecom.value": testReqBody.telecom[0].value,
							"meta.created": testDate1,
							"meta.last_updated": testDate1,
							per_page: testPage,
							page: testPage,
						},
					});

					expect(JSON.parse(response.body)).toStrictEqual({
						error: "Unauthorized",
						message:
							"You do not have permission to perform an HTTP GET request on this route",
						statusCode: 401,
					});
					expect(response.statusCode).toBe(401);
				});
			});

			describe("/:id PUT requests", () => {
				it("Returns HTTP status code 401 if not in permitted access", async () => {
					const response = await server.inject({
						method: "PUT",
						url: `/${testId}`,
						headers: {
							"content-type": "application/json",
						},
						body: testReqBody,
					});

					expect(JSON.parse(response.body)).toStrictEqual({
						error: "Unauthorized",
						message:
							"You do not have permission to perform an HTTP PUT request on this route",
						statusCode: 401,
					});
					expect(response.statusCode).toBe(401);
				});
			});

			describe("/ POST requests", () => {
				it("Returns HTTP status code 401 if not in permitted access", async () => {
					const response = await server.inject({
						method: "POST",
						url: "/",
					});

					expect(JSON.parse(response.body)).toStrictEqual({
						error: "Unauthorized",
						message:
							"You do not have permission to perform an HTTP POST request on this route",
						statusCode: 401,
					});
					expect(response.statusCode).toBe(401);
				});
			});
		});
	});
});
