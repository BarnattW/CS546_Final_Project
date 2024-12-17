import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { customersDataFunctions } from "../data/customers.js";
import * as seller from "../data/seller.js";

export async function runSetup() {
	const db = await dbConnection();
	await db.dropDatabase();

	// Creating two customers
	let customer1 = await customersDataFunctions.createCustomer(
		"mwong",
		"Password123",
		"Madison"
	);
	let customer2 = await customersDataFunctions.createCustomer(
		"oboghra",
		"Password456",
		"Om"
	);

	// Seller data
	const sellerNames = [
		{
			username: "hwang",
			password: "Password789",
			name: "Harry Wang",
			location: "NYC",
		},
		{
			username: "barnattwu",
			password: "Password101",
			name: "Barnatt Wu",
			location: "Hoboken",
		},
		{
			username: "jchen",
			password: "Password234",
			name: "Jason Chen",
			location: "Hoboken",
		},
		{
			username: "achibana",
			password: "Password345",
			name: "Amane Chibana",
			location: "NYC",
		},
		{
			username: "mli",
			password: "Password456",
			name: "Ming Li",
			location: "Queens",
		},
	];

	// Create sellers and listings
	for (let s of sellerNames) {
		let createdSeller = await seller.createSeller(
			s.username,
			s.password,
			s.name,
			s.location
		);

		for (let i = 1; i <= 5; i++) {
			await seller.createListing(
				createdSeller._id.toString(),
				`Product ${i} by ${s.name}`,
				`${s.name}'s product ${i} description`,
				i * 20 + 20, // Example pricing logic
				`https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQLAPGLHDuDHw9akKUkLTYMFZ-pc0UJOTz-YfLEnRj7MBZUOdb4mr2AG4ZsmgqJXJLR9XbwEn7grSlOIipErci5I8frzGHgJMxn8GfJMGscS9IMA-tyJ40iRA`,
				["chairs", "desks", "tables", "sofas", "beds"][i % 5],
				["new", "used", "minimal wear", "refurbished", "like new"][i % 5]
			);
		}
	}

	console.log("Done seeding database");
	closeConnection();
}

await runSetup();
