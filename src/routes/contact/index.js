/**
 * Routes required:
 * DELETE /:id
 * POST with JSON body
 * PUT with /:id
 * GET with /:id
 * GET with ?match.type=example&match.value=example, where match.value uses LIKE 'value%'
 *
 * support: match.type, match.value, match.receiver, telecom.value, page, per_page, last_updated
 *
 *
 * gp_id
 * postcode
 * school_code
 *
 * {
 *  "link": "", // do not include with read
 * 	"entry": [
 * 		{
 *          "url": "", // do not include with read
 * 			"id": "9999-9999-9999-9999",
 * 			"match": {
 * 				"type": "postcode",
 * 				"value": "BA229RZ",
 * 				"receiver": "Sherborne"
 * 			},
 * 			"telecom": [
 * 				{
 * 					"system": "email",
 * 					"value": "dhc.hvhub.west@nhs.net",
 * 					"use": "Health Visitors"
 * 				},
 * 				{
 * 					"system": "email",
 * 					"value": "CommunityDischarges@ydh.nhs.uk",
 * 					"use": "Community Midwives"
 * 				}
 * 			],
 * 			"meta": {
 * 				"created": "2019-10-14 13:55:35.217",
 * 				"last_updated": "2019-10-14 13:55:35.217"
 * 			}
 * 		}
 * 	],
 * 	"meta": {
 * 		"pagination": {
 * 			"total": 1,
 * 			"per_page": 1,
 * 			"current_page": 1,
 * 			"total_pages": 1
 * 		}
 * 	}
 * }
 *
 */
