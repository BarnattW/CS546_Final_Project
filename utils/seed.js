async function seed() {
	// connect to database
	const db = await dbConnection();
	await db.dropDatabase();

	// insert seed data
}

export default seed;
