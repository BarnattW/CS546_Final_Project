import { dbConnection } from "./mongoConnection.js";
// this is some more comments
const getCollectionFn = (collection) => {
	let _col = undefined;

	return async () => {
		if (!_col) {
			const db = await dbConnection();
			_col = await db.collection(collection);
		}

		return _col;
	};
};

export const intializeCollectionFn = async (collection) => {
	const db = await dbConnection();
	const collectionExists = await db
		.listCollections({ name: collection })
		.hasNext();
	if (!collectionExists) {
		await db.createCollection(collection);
	}
};

export const customers = getCollectionFn("customers");
export const sellers = getCollectionFn("sellers");
export const listings = getCollectionFn("listings");
