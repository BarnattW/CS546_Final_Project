import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import * as customer from "../data/customers.js";
import * as seller from "../data/seller.js";
import * as comment from "../data/comments.js";
import * as review from "../data/reviews.js";
import * as order from "../data/orders.js";

const db = await dbConnection();
await db.dropDatabase();

let madison = await customer.createCustomer("mwong", "Password123", "Madison");
let om = await customer.createCustomer("oboghra", "Password456", "Om");
let harry = await seller.createSeller("hwang", "Password789", "Ducks4Life", "NYC");
let barnatt = await seller.createSeller("barnattwu", "Password101", "Quack", "Hoboken");

let madisonID = madison._id.toString();
let omID = om._id.toString();
let harryID = harry._id.toString();
let barnattID = barnatt._id.toString();

let listing1 = await seller.createListing(harryID, 
	"Chair", 
	"This chair makes students very motivated to do schoolwork!", 
	40, 
	"https://www.uloft.com/wp-content/uploads/2011/08/gradNatural-10Ply2-2198-300.jpg",
	"chairs",
	"used"
);

let listing2 = await seller.createListing(harryID, 
	"Gaming Chair", 
	"This chair makes students very motivated to play Valorant!", 
	80, 
	"https://i5.walmartimages.com/asr/fdb58c83-7f52-44d8-b9c6-01d017febdfc_1.ad7968d2302d8c0d9bc5200befb91e70.jpeg",
	"chairs",
	"new"
);

let listing3 = await seller.createListing(barnattID, 
	"Coffee Table", 
	"Great for living room storage.", 
	40, 
	"https://assets.wfcdn.com/im/70797925/compr-r85/2571/257137958/Katara+Solid+Ash+Wood+Coffee+Table%2C+Glass+Coffee+Table.jpg",
	"coffee-tables",
	"Minimal Wear"
);

let listing1ID = listing1._id.toString()
let listing2ID = listing2._id.toString()
let listing3ID = listing3._id.toString()

let comment1 = await comment.createComment(
	madisonID,
	"Madison",
	listing1ID,
	"This chair reminds me of Davis Hall."
);

let comment2 = await comment.createComment(
	omID,
	"Om",
	listing1ID,
	"Many college dorms have rocking chairs like this."
);

let comment3 = await comment.createComment(
	madisonID,
	"Madison",
	listing3ID,
	"I wish this came in pink."
);

let review1 = review.reviewDataFunctions.createReview(
	madisonID,
	"Madison",
	listing2ID,
	4,
	"Love this just wish it was pink."
);

let review2 = review.reviewDataFunctions.createReview(
	omID,
	"Om",
	listing2ID,
	5,
	"Great for getting homework and gaming done!"
);

let orderItem1 = {
	itemId: listing1ID,
	quantity: 1
};

let order1 = order.orderDataFunctions.createOrder(
	madisonID,
	orderItem1,
	"1 Castle Point Terrace",
	40
);

let orderItem2 = {
	itemId: listing3ID,
	quantity: 1
};

let order2 = order.orderDataFunctions.createOrder(
	omID,
	orderItem2,
	"1 River Street",
	80
);

console.log('Done seeding database');

await closeConnection();
