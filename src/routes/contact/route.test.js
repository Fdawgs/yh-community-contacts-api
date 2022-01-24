const faker = require("faker");
const Fastify = require("fastify");
const sensible = require("fastify-sensible");
const route = require(".");
const getConfig = require("../../config");
const cleanObject = require("../../plugins/clean-object");
const convertDateParamOperator = require("../../plugins/convert-date-param-operator");
const sharedSchemas = require("../../plugins/shared-schemas");

const mockPage = 1;

const mockDate1 = faker.date.past().toISOString().split("T")[0];
const mockDate2 = faker.date.past().toISOString().split("T")[0];

const mockId = "b8e7265c-4733-44be-9238-7d7b8718fb88";
const mockPayload = {
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

const mockResult = {
	id: mockId,
	match_type: mockPayload.match.type,
	match_value: mockPayload.match.value,
	match_receiver: mockPayload.match.receiver,
	created: "2022-01-18T14:07:48.190Z",
	last_updated: "2022-01-18T14:07:48.190Z",
};

const mockSearchResult = {
	link: expect.any(String),
	meta: {
		pagination: {
			total: expect.any(Number),
			per_page: mockPage,
			current_page: mockPage,
			total_pages: expect.any(Number),
		},
	},
	entry: [
		{
			url: expect.any(String),
			id: mockId,
			meta: {
				created: mockResult.created,
				last_updated: mockResult.last_updated,
			},
			...mockPayload,
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
					post: {
						error: {
							rowsAffected: [0],
						},
						ok: {
							rowsAffected: [1],
						},
					},
					getRead: {
						error: {
							recordsets: [],
						},
						ok: {
							recordsets: [
								[
									{
										...mockResult,
										telecom: JSON.stringify(
											mockPayload.telecom
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
										...mockResult,
										telecom: JSON.stringify(
											mockPayload.telecom
										),
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
									...mockResult,
									telecom: mockPayload.telecom,
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
										...mockResult,
										telecom: mockPayload.telecom,
									},
								],
							},
						],
					},
					post: { error: { rowCount: 0 }, ok: { rowCount: 1 } },
					put: { error: { rowCount: 0 }, ok: { rowCount: 1 } },
				},
			},
		},
	];
	connectionTests.forEach((testObject) => {
		describe(`${testObject.testName}`, () => {
			let config;
			let server;

			beforeAll(async () => {
				Object.assign(process.env, testObject.envVariables);
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
						url: `/${mockId}`,
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
						url: `/${mockId}`,
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
						url: `/${mockId}`,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.payload)).toEqual({
						error: "Internal Server Error",
						message:
							"Unable to delete contact record from database",
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
						url: `/${mockId}`,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.payload)).toEqual({
						id: mockId,
						meta: {
							created: "2022-01-18T14:07:48.190Z",
							last_updated: "2022-01-18T14:07:48.190Z",
						},
						...mockPayload,
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
						url: `/${mockId}`,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.payload)).toEqual({
						error: "Not Found",
						message: "Contact record(s) not found",
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
						url: `/${mockId}`,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.payload)).toEqual({
						error: "Internal Server Error",
						message: "Unable to return result(s) from database",
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
							"match.type": mockResult.match_type,
							"match.value": mockResult.match_value,
							"match.receiver": mockResult.match_receiver,
							"telecom.value": mockPayload.telecom[0].value,
							"meta.created": mockDate1,
							"meta.last_updated": mockDate1,
							per_page: mockPage,
							page: mockPage,
						},
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.payload)).toEqual(
						mockSearchResult
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
							"meta.created": [mockDate1, mockDate2],
							"meta.last_updated": [mockDate1, mockDate2],
						},
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.payload)).toEqual(
						mockSearchResult
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
							"meta.created": `ge${mockDate1}`,
							"meta.last_updated": `ge${mockDate1}`,
						},
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.payload)).toEqual(
						mockSearchResult
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
							"match.type": mockResult.match_type,
						},
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.payload)).toEqual({
						link: expect.any(String),
						meta: {
							pagination: {
								total: 0,
								per_page: mockPage,
								current_page: mockPage,
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
							"match.type": mockResult.match_type,
						},
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.payload)).toEqual({
						error: "Internal Server Error",
						message: "Unable to return result(s) from database",
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
						url: `/${mockId}`,
						headers: {
							"content-type": "application/json",
						},
						payload: mockPayload,
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
						url: `/${mockId}`,
						headers: {
							"content-type": "application/javascript",
						},
						payload: mockPayload,
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
						url: `/${mockId}`,
						headers: {
							"content-type": "application/json",
						},
						payload: mockPayload,
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
						url: `/${mockId}`,
						headers: {
							"content-type": "application/json",
						},
						payload: mockPayload,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.payload)).toEqual({
						error: "Internal Server Error",
						message: "Unable to update contact record in database",
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
						url: `/${mockId}`,
						headers: {
							"content-type": "application/json",
						},
						payload: mockPayload,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.payload)).toEqual({
						error: "Internal Server Error",
						message:
							"A contact record with this match.type and match.value combination already exists",
						statusCode: 500,
					});
					expect(response.statusCode).toBe(500);
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
						payload: mockPayload,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(response.payload).toBe("");
					expect(response.statusCode).toBe(204);
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
						payload: mockPayload,
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
						payload: mockPayload,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.payload)).toEqual({
						error: "Internal Server Error",
						message: "Unable to add contact record to database",
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
						payload: mockPayload,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.payload)).toEqual({
						error: "Internal Server Error",
						message: "Unable to add contact record to database",
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
						payload: mockPayload,
					});

					expect(mockQueryFn).toHaveBeenCalledTimes(1);
					expect(JSON.parse(response.payload)).toEqual({
						error: "Internal Server Error",
						message:
							"A contact record with this match.type and match.value combination already exists",
						statusCode: 500,
					});
					expect(response.statusCode).toBe(500);
				});
			});
		});
	});
});
