import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { customersDataFunctions } from "../data/customers.js";
import { orderDataFunctions } from "../data/orders.js";
import * as seller from "../data/seller.js";
import { reviewsDataFunctions } from "../data/reviews.js";
import { commentsDataFunctions } from "../data/comments.js";

export async function runSetup() {
	console.log("Seeding database");
	const db = await dbConnection();
	await db.dropDatabase();

	// Seller data
	const sellerNames = [
		{
			username: "furni_world123",
			password: "Comfort2024!",
			businessName: "FurniWorld",
			location: "Hoboken",
		},
		{
			username: "modern_haven45",
			password: "Haven45Secure",
			businessName: "Modern Haven",
			location: "Secaucus",
		},
		{
			username: "cozycorner",
			password: "12345678",
			businessName: "Cozy Corner Furniture",
			location: "Jersey City",
		},
		{
			username: "rustic_vibes001",
			password: "RusticStrong88",
			businessName: "Rustic Vibes",
			location: "New York",
		},
		{
			username: "urban1",
			password: "12345678",
			businessName: "Urban Oasis",
			location: "Newark",
		},
	];

	// Create sellers and listings
	const listingsList = [];
	for (let s of sellerNames) {
		let createdSeller = await seller.createSeller(
			s.username,
			s.password,
			s.businessName,
			s.location
		);

		// Create 5 listings for each seller
		const listings = [
			{
				itemName: "Chair",
				itemDescription: "A comfortable chair",
				itemPrice: 50,
				itemImage:
					"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM6m1p9SgXPYsgCqLBu59VtL7sKqFgHpNyYA&s",
				itemCategory: "chairs",
				itemCondition: "new",
			},
			{
				itemName: "Desk",
				itemDescription: "A sturdy desk",
				itemPrice: 100,
				itemImage:
					"https://oakywood.shop/cdn/shop/files/configurator_roundsteep_oak_view_01_black_a_1116da5d-7293-42eb-9e3c-afa79ad5d9f4.jpg?height=1920&v=1718268543",
				itemCategory: "desks",
				itemCondition: "used",
			},
			{
				itemName: "Table",
				itemDescription: "A large table",
				itemPrice: 150,
				itemImage:
					"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHjPR-2shKF46R9BUC86mPHpW378Z-i_2V1A&s",
				itemCategory: "tables",
				itemCondition: "minimal wear",
			},
			{
				itemName: "Sofa",
				itemDescription: "A cozy sofa",
				itemPrice: 200,
				itemImage:
					"https://medleyhome.com/cdn/shop/files/kirnik-sofa-106-linara-jicama-02.jpg?v=1713315799&width=2048",
				itemCategory: "sofas",
				itemCondition: "refurbished",
			},
			{
				itemName: "Bed",
				itemDescription: "A king-sized bed",
				itemPrice: 250,
				itemImage:
					"https://assets.wfcdn.com/im/65594651/resize-h800-w800%5Ecompr-r85/2759/275944225/Chandlor+Panel+Bed.jpg",
				itemCategory: "beds",
				itemCondition: "like new",
			},
		];

		for (let i = 1; i <= 5; i++) {
			const listing = await seller.createListing(
				createdSeller._id.toString(),
				listings[i - 1].itemName,
				listings[i - 1].itemDescription + ` by ${createdSeller.businessName}`,
				listings[i - 1].itemPrice,
				listings[i - 1].itemImage,
				listings[i - 1].itemCategory,
				listings[i - 1].itemCondition
			);
			listingsList.push(listing);
		}
	}

	// Creating two customers
	const customer1 = await customersDataFunctions.createCustomer(
		"barneywoo",
		"12345678",
		"Barnatt Wu"
	);
	const customer2 = await customersDataFunctions.createCustomer(
		"fischer",
		"Password123",
		"Fischer"
	);

	// Adding items to cart
	await customersDataFunctions.addToCart(
		customer1._id.toString(),
		listingsList[0]._id.toString(),
		2
	);

	await customersDataFunctions.addToCart(
		customer1._id.toString(),
		listingsList[10]._id.toString(),
		1
	);

	await customersDataFunctions.addToCart(
		customer1._id.toString(),
		listingsList[22]._id.toString(),
		1
	);

	await customersDataFunctions.addToCart(
		customer2._id.toString(),
		listingsList[2]._id.toString(),
		3
	);

	// add to wishlist
	await customersDataFunctions.addToWishlist(
		customer1._id.toString(),
		listingsList[1]._id.toString()
	);

	await customersDataFunctions.addToWishlist(
		customer1._id.toString(),
		listingsList[11]._id.toString()
	);

	// make an order
	const cart = await customersDataFunctions.getCustomerCart(
		customer1._id.toString()
	);
	const order1 = {
		customerId: customer1._id.toString(),
		name: "Barnatt Wu",
		orderItems: cart.populatedCart,
		shippingAddress: "123 Main St Hoboken, NJ 07030 USA",
		cardNumber: "1234567812345678",
		expirationDate: "12/25",
		cvv: "123",
		cost: cart.totalPrice,
	};
	await orderDataFunctions.createOrder(
		order1.customerId,
		order1.name,
		order1.orderItems,
		order1.shippingAddress,
		order1.cardNumber,
		order1.expirationDate,
		order1.cvv,
		order1.cost
	);

	// add more to cart of customer1
	await customersDataFunctions.addToCart(
		customer1._id.toString(),
		listingsList[3]._id.toString(),
		2
	);

	// add reviews
	await reviewsDataFunctions.createReview(
		customer1._id.toString(),
		"Barnatt Wu",
		listingsList[0]._id.toString(),
		4,
		"Great chair! Very comfortable."
	);

	await reviewsDataFunctions.createReview(
		customer1._id.toString(),
		"Barnatt Wu",
		listingsList[1]._id.toString(),
		5,
		"Excellent desk. Very sturdy."
	);

	await reviewsDataFunctions.createReview(
		customer2._id.toString(),
		"Fischer",
		listingsList[2]._id.toString(),
		3,
		"Good table. A bit wobbly."
	);

	// add comments
	await commentsDataFunctions.createComment(
		customer1._id.toString(),
		"Barnatt Wu",
		listingsList[0]._id.toString(),
		"Great chair! Very comfortable."
	);

	await commentsDataFunctions.createComment(
		customer1._id.toString(),
		"Barnatt Wu",
		listingsList[1]._id.toString(),
		"Excellent desk. Very sturdy."
	);

	await commentsDataFunctions.createComment(
		customer2._id.toString(),
		"Fischer",
		listingsList[2]._id.toString(),
		"Good table. A bit wobbly."
	);

	console.log("Done seeding database");
	closeConnection();
}

await runSetup();
