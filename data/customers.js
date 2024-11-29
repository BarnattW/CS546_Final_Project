import { customers } from "../config/mongoCollections.js";
import { checkId } from "../utils/checks.js";

/*
 * Returns a customer from db given a customer's id
 */
const getCustomerById = async (id) => {
	id = checkId(id);
	const customersCollection = await customers();
	const customer = await customersCollection.findOne({ _id: new ObjectId(id) });
	if (!customer) throw "Error: Customer not found";

	return customer;
};

export const customerDataFunctions = { getCustomerById };
