async function seed() {
	// connect to database
	const db = await dbConnection();
	await db.dropDatabase();

	// insert seed data, 1 fake customer, and 1 fake seller with 3 listings
}

export default seed;
