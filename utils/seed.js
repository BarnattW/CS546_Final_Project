import { customerDataFunctions } from "../data/customers.js";

async function seed() {
	// connect to database
	const db = await dbConnection();
	await db.dropDatabase();

	// insert seed data, 1 fake customer, and 1 fake seller with 3 listings
	const customer = await customerDataFunctions.createCustomer(
		"bobby",
		"bobby123",
		"Bob"
	);
}

export default seed;
