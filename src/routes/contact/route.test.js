const { faker } = require("@faker-js/faker");
const Fastify = require("fastify");
const sensible = require("@fastify/sensible");
const route = require(".");
const getConfig = require("../../config");
const cleanObject = require("../../plugins/clean-object");
const convertDateParamOperator = require("../../plugins/convert-date-param-operator");
const sharedSchemas = require("../../plugins/shared-schemas");

const testPage = 1;

const testDate1 = faker.date.past().toISOString().split("T")[0];
const testDate2 = faker.date.past().toISOString().split("T")[0];

const testId = "b8e7265c-4733-44be-9238-7d7b8718fb88";
const testPayload = {
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
			value: "examplemidwife@ydh.nhs.uk",
			use: "Community Midwives",
		},
	],
};

const testResult = {
	id: testId,
	match_type: testPayload.match.type,
	match_value: testPayload.match.value,
	match_receiver: testPayload.match.receiver,
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
				created: testResult.created,
				last_updated: testResult.last_updated,
			},
			...testPayload,
		},
	],
};

describe("Contact Route", () => {
	const connectionTests = [
		{
			testName: "MSSQL Connection",
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
										...testResult,
										telecom: JSON.stringify(
											testPayload.telecom
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
										...testResult,
										telecom: JSON.stringify(
											testPayload.telecom
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
			testName: "PostgreSQL Connection",
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
									...testResult,
									telecom: testPayload.telecom,
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
										...testResult,
										telecom: testPayload.telecom,
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
		describe(`${testObject.testName} - With Request Scopes`, () => {
			let config;
			let server;

			beforeAll(async () => {
				Object.assign(process.env, {
					BEARER_TOKEN_AUTH_ENABLED: true,
					...testObject.envVariables,
				});
				config = await getConfig();

				server = Fastify();
				server
					.register(cleanObject)
					.register(convertDateParamOperator)
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
					.register(route, config);

				await server.ready();
			});

			afterAll(async () => {
				await server.close();
			});

			describe("/:id DELETE Requests", () => {
				test("Should delete a contact record", async () => {
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
					expect(response.payload).toBe("");
					expect(response.statusCode).toBe(204);
				});

				test("Should return HTTP status code 404 if contact record missing or already deleted", async () => {
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
					expect(JSON.parse(response.payload)).toEqual({
						error: "Not Found",
						message:
							"Contact record does not exist or has already been deleted",
						statusCode: 404,
					});
					expect(response.statusCode).toBe(404);
				});

				test("Should return HTTP status code 500 if connection issue encountered", async () => {
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
					expect(JSON.parse(response.payload)).toEqual({
						error: "Internal Server Error",
						message: "Error: Failed to connect to DB",
						statusCode: 500,
					});
					expect(response.statusCode).toBe(500);
				});
			});

			describe("/:id GET Requests", () => {
				test("Should return contact record", async () => {
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
					expect(JSON.parse(response.payload)).toEqual({
						id: testId,
						meta: {
							created: "2022-01-18T14:07:48.190Z",
							last_updated: "2022-01-18T14:07:48.190Z",
						},
						...testPayload,
					});
					expect(response.statusCode).toBe(200);
				});

				test("Should return HTTP status code 404 if contact record missing", async () => {
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
					expect(JSON.parse(response.payload)).toEqual({
						error: "Not Found",
						message: "Contact record not found",
						statusCode: 404,
					});
					expect(response.statusCode).toBe(404);
				});

				test("Should return HTTP status code 500 if connection issue encountered", async () => {
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
					expect(JSON.parse(response.payload)).toEqual({
						error: "Internal Server Error",
						message: "Error: Failed to connect to DB",
						statusCode: 500,
					});
					expect(response.statusCode).toBe(500);
				});
			});

			describe("/ GET Requests", () => {
				test("Should return contact record, using all query string parameters", async () => {
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
							"match.type": testResult.match_type,
							"match.value": testResult.match_value,
							"match.receiver": testResult.match_receiver,
							"telecom.value": testPayload.telecom[0].value,
							"meta.created": testDate1,
							"meta.last_updated": testDate1,
							per_page: testPage,
							page: testPage,
						},
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.payload)).toEqual(
						expSearchResult
					);
					expect(response.statusCode).toBe(200);
				});

				test("Should return contact record, using more than one `meta.created` and `meta.last_updated` query string params", async () => {
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
					expect(JSON.parse(response.payload)).toEqual(
						expSearchResult
					);
					expect(response.statusCode).toBe(200);
				});

				test("Should return contact record, using operators in the `meta.created` and `meta.last_updated` query string params", async () => {
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
					expect(JSON.parse(response.payload)).toEqual(
						expSearchResult
					);
					expect(response.statusCode).toBe(200);
				});

				test("Should return no contact records if table empty", async () => {
					const mockQueryFn = jest.fn().mockResolvedValue({});

					server.db = {
						query: mockQueryFn,
					};

					const response = await server.inject({
						method: "GET",
						url: "/",
						query: {
							"match.type": testResult.match_type,
						},
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.payload)).toEqual({
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

				test("Should return HTTP status code 400 if no query string params present", async () => {
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
					expect(JSON.parse(response.payload)).toEqual({
						error: "Bad Request",
						message: "No valid query string parameters provided",
						statusCode: 400,
					});
					expect(response.statusCode).toBe(400);
				});

				test("Should return HTTP status code 500 if connection issue encountered", async () => {
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
							"match.type": testResult.match_type,
						},
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.payload)).toEqual({
						error: "Internal Server Error",
						message: "Error: Failed to connect to DB",
						statusCode: 500,
					});
					expect(response.statusCode).toBe(500);
				});
			});

			describe("/:id PUT Requests", () => {
				test("Should update contact record", async () => {
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
						payload: testPayload,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(response.payload).toBe("");
					expect(response.statusCode).toBe(204);
				});

				test("Should return HTTP status code 415 if content-type in `Content-Type` request header unsupported", async () => {
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
						payload: testPayload,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(0);
					expect(JSON.parse(response.payload)).toEqual({
						error: "Unsupported Media Type",
						message:
							"Unsupported Media Type: application/javascript",
						statusCode: 415,
					});
					expect(response.statusCode).toBe(415);
				});

				test("Should return HTTP status code 404 if contact record with id not found", async () => {
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
						payload: testPayload,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.payload)).toEqual({
						error: "Not Found",
						message:
							"Contact record does not exist or has already been deleted",
						statusCode: 404,
					});
					expect(response.statusCode).toBe(404);
				});

				test("Should return HTTP status code 500 if connection issue encountered", async () => {
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
						payload: testPayload,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.payload)).toEqual({
						error: "Internal Server Error",
						message: "Error: Failed to connect to DB",
						statusCode: 500,
					});
					expect(response.statusCode).toBe(500);
				});

				test("Should return HTTP status code 500 if primary key constraint violation occurs", async () => {
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
						payload: testPayload,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.payload)).toEqual({
						error: "Bad Request",
						message:
							"A contact record with this match.type and match.value combination already exists",
						statusCode: 400,
					});
					expect(response.statusCode).toBe(400);
				});
			});

			describe("/ POST Requests", () => {
				test("Should create contact record", async () => {
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
						payload: testPayload,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.payload)).toEqual({
						id: testId,
					});
					expect(response.headers).toMatchObject({
						location: expect.stringContaining(`/contact/${testId}`),
					});
					expect(response.statusCode).toBe(201);
				});

				test("Should return HTTP status code 415 if content-type in `Content-Type` request header unsupported", async () => {
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
						payload: testPayload,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(0);
					expect(JSON.parse(response.payload)).toEqual({
						error: "Unsupported Media Type",
						message:
							"Unsupported Media Type: application/javascript",
						statusCode: 415,
					});
					expect(response.statusCode).toBe(415);
				});

				test("Should return HTTP status code 500 if unable to update a contact record", async () => {
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
						payload: testPayload,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.payload)).toEqual({
						error: "Internal Server Error",
						message: "Error",
						statusCode: 500,
					});
					expect(response.statusCode).toBe(500);
				});

				test("Should return HTTP status code 500 if connection issue encountered", async () => {
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
						payload: testPayload,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.payload)).toEqual({
						error: "Internal Server Error",
						message: "Error: Failed to connect to DB",
						statusCode: 500,
					});
					expect(response.statusCode).toBe(500);
				});

				test("Should return HTTP status code 500 if primary key constraint violation occurs", async () => {
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
						payload: testPayload,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.payload)).toEqual({
						error: "Bad Request",
						message:
							"A contact record with this match.type and match.value combination already exists",
						statusCode: 400,
					});
					expect(response.statusCode).toBe(400);
				});
			});
		});

		describe(`${testObject.testName} - Without Request Scopes`, () => {
			let config;
			let server;

			beforeAll(async () => {
				Object.assign(process.env, {
					BEARER_TOKEN_AUTH_ENABLED: true,
					...testObject.envVariables,
				});
				config = await getConfig();

				server = Fastify();
				server
					.register(cleanObject)
					.register(convertDateParamOperator)
					.register(sensible)
					.register(sharedSchemas)
					.register(route, config);

				await server.ready();
			});

			afterAll(async () => {
				await server.close();
			});

			describe("/:id DELETE Requests", () => {
				test("Should return HTTP status code 401 if not in permitted access", async () => {
					const response = await server.inject({
						method: "DELETE",
						url: `/${testId}`,
					});

					expect(JSON.parse(response.payload)).toEqual({
						error: "Unauthorized",
						message:
							"You do not have permission to perform an HTTP DELETE request on this route",
						statusCode: 401,
					});
					expect(response.statusCode).toBe(401);
				});
			});

			describe("/:id GET Requests", () => {
				test("Should return HTTP status code 401 if not in permitted access", async () => {
					const response = await server.inject({
						method: "GET",
						url: `/${testId}`,
					});

					expect(JSON.parse(response.payload)).toEqual({
						error: "Unauthorized",
						message:
							"You do not have permission to perform an HTTP GET request on this route",
						statusCode: 401,
					});
					expect(response.statusCode).toBe(401);
				});
			});

			describe("/ GET Requests", () => {
				test("Should return HTTP status code 401 if not in permitted access", async () => {
					const response = await server.inject({
						method: "GET",
						url: "/",
						query: {
							"match.type": testResult.match_type,
							"match.value": testResult.match_value,
							"match.receiver": testResult.match_receiver,
							"telecom.value": testPayload.telecom[0].value,
							"meta.created": testDate1,
							"meta.last_updated": testDate1,
							per_page: testPage,
							page: testPage,
						},
					});

					expect(JSON.parse(response.payload)).toEqual({
						error: "Unauthorized",
						message:
							"You do not have permission to perform an HTTP GET request on this route",
						statusCode: 401,
					});
					expect(response.statusCode).toBe(401);
				});
			});

			describe("/:id PUT Requests", () => {
				test("Should return HTTP status code 401 if not in permitted access", async () => {
					const response = await server.inject({
						method: "PUT",
						url: `/${testId}`,
						headers: {
							"content-type": "application/json",
						},
						payload: testPayload,
					});

					expect(JSON.parse(response.payload)).toEqual({
						error: "Unauthorized",
						message:
							"You do not have permission to perform an HTTP PUT request on this route",
						statusCode: 401,
					});
					expect(response.statusCode).toBe(401);
				});
			});

			describe("/ POST Requests", () => {
				test("Should return HTTP status code 401 if not in permitted access", async () => {
					const response = await server.inject({
						method: "POST",
						url: "/",
					});

					expect(JSON.parse(response.payload)).toEqual({
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
