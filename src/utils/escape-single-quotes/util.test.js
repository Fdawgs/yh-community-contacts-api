const util = require(".");

describe("Escape-Single-Quote Util", () => {
	test("Should replace single-quote character in expression with two adjacent single quotes", () => {
		const response = util`${"Yeovil's"} Hospital`;
		expect(response).toBe("Yeovil''s Hospital");
	});
});
