"use strict";

const Fastify = require("fastify");
const plugin = require(".");

describe("Clean-Object plugin", () => {
	/** @type {Fastify.FastifyInstance} */
	let server;

	beforeAll(async () => {
		server = Fastify();

		await server.register(plugin);
		server.put("/", (req, res) => {
			res.send(server.cleanObject(req.body));
		});

		server.put("/empty", (_req, res) => {
			res.send(server.cleanObject());
		});

		await server.ready();
	});

	afterAll(async () => server.close());

	it("Recursively removes keys from request object where value is undefined or null", async () => {
		const response = await server.inject({
			method: "PUT",
			url: "/",
			headers: {
				"content-type": "application/json",
			},
			body: {
				test1: undefined,
				test2: null,
				test3: [{ testobj: null }],
				test4: 2,
			},
		});

		expect(JSON.parse(response.body)).toStrictEqual({
			test3: [{}],
			test4: 2,
		});
		expect(response.statusCode).toBe(200);
	});

	it("Returns empty object if request body not passed to plugin function", async () => {
		const response = await server.inject({
			method: "PUT",
			url: "/empty",
		});

		expect(JSON.parse(response.body)).toStrictEqual({});
		expect(response.statusCode).toBe(200);
	});
});
