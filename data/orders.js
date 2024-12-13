import { ObjectId } from 'mongodb';
import { customers, sellers } from '../config/mongoCollections.js';
import {
  checkId,
  checkIsPositiveInteger,
  checkString,
} from '../utils/checks.js';
import { sellersData } from './index.js';

/* TO-DO
 * Orders -> likely to change to support payment info and shipping status
 * {
 *  customerId : ObjectId,
 *  orderItems : [],
 *  shippingAddress : String,
 *  cost : Number,
 *  orderDate : Date,
 *  orderStatus : String // Received, Shipping, Delivered
 * }
 */

/*
 * Given an array of itemIds, return an array of populated listing items
 */
const populateOrderItems = async (itemIds) => {
  itemIds.forEach((itemId) => {
    itemId = itemId.toString();
  });

  const populatedItems = await Promise.all(
    itemIds.map(async (itemId) => {
      const listing = await sellersData.getListingById(itemId);
      return {
        _id: itemId,
        listing: listing,
      };
    })
  );
  return populatedItems;
};

/*
 * Returns a customer's populated orders
 */
const getCustomerOrders = async (customerId) => {
  customerId = checkId(customerId, 'customerId');

  const customersCollection = await customers();
  const customer = await customersCollection.findOne(
    {
      _id: new ObjectId(customerId),
    },
    {
      projection: { _id: 0, orders: 1 },
    }
  );

  if (!customers) throw `No orders found for customer with id ${customerId}`;

  if (customer.length === 0) return;

  // populate orders with items
  const customerOrders = customer.orders;
  customerOrders.forEach(async (order) => {
    order.orderItems = await populateOrderItems(order.orderItems);
  });

  return customerOrders;
};

/*
 * Returns a customer's order with populated listings
 */
const getCustomerOrder = async (customerId, orderId) => {
  customerId = checkId(customerId);
  orderId = checkId(orderId);

  const customersCollection = await customers();
  const customerOrder = await customersCollection.findOne(
    {
      _id: new ObjectId(customerId),
      'orders._id': orderId,
    },
    {
      projection: { _id: 0, orders: 1 },
    }
  );

  print(customerOrder);
  if (!customerOrder || customerOrder.length === 0)
    throw `No order found with orderId ${orderId}`;

  customerOrder = customerOrder[0];
  customerOrder.orderItems = await populateOrderItems(customerOrder.orderItems);

  return customerOrder;
};

/*
 * Returns all seller orders
 */
const getSellerOrders = async (sellerId) => {
  sellerId = checkId(sellerId, 'sellerId');

  const sellersCollection = await sellers();
  const sellerOrders = await sellersCollection.findOne(
    {
      _id: new ObjectId(sellerId),
    },
    {
      projection: { _id: 0, orders: 1 },
    }
  );

  if (!sellerOrders) throw `No orders found for seller with id ${sellerId}`;

  if (sellerOrders.orders.length === 0) return;

  // populate each order's orderItems
  sellerOrders.orders.forEach(async (order) => {
    order.orderItem = await populateOrderItems(order.orderItems);
  });

  return sellerOrders;
};

/*
 * Returns all seller orders
 */
const getSellerOrder = async (sellerId, orderId) => {
  sellerId = checkId(sellerId, 'sellerId');
  orderId = checkId(orderId, 'orderId');

  const sellersCollection = await sellers();
  const sellerOrder = await sellersCollection.findOne(
    {
      _id: new ObjectId(sellerId),
      'orders._id': orderId,
    },
    {
      projection: { _id: 0, orders: 1 },
    }
  );

  if (!sellerOrder || sellerOrder.length === 0)
    throw `No order found with orderId ${orderId}`;

  sellerOrder = sellerOrder[0];
  sellerOrder.orderItems = await populateOrderItems(sellerOrder.orderItems);

  return sellerOrder;
};

/*
 * Creates a new order for a user and associated sellers
 */
const createOrder = async (customerId, orderItems, shippingAddress, cost) => {
  // replicate order across both sellers and the customer
  customerId = checkId(customerId, 'customerId');
  orderItems.map((orderItem) => {
    orderItem = sanitizeObject(orderItem);
    orderItem.itemId = checkId(orderItem.listingId, 'listingIdId');
    checkIsPositiveInteger(orderItem.quantity);
    return orderItem;
  });
  // check if orderItems are valid items

  await Promise.all(
    orderItems.forEach(async (orderItem) => {
      const listing = await sellersData.getListingById(itemId);
      if (!listing) throw `Invalid orderItem`;
    })
  );
  shippingAddress = checkString(shippingAddress, 'shippingAddress'); // update to check address
  checkIsPositiveInteger(cost);

  const newOrder = {
    customerId: customerId,
    orderItems: orderItems,
    shippingAddress: shippingAddress,
    cost: cost,
    orderDate: new Date(),
  };

  const customersCollection = await customers();
  const sellersCollection = await sellers();
  const updatedCustomerOrders = await customersCollection.updateOne(
    {
      _id: new ObjectId(customerId),
    },
    {
      $push: { orders: newOrder },
    }
  );

  print(updatedCustomerOrders);
  if (!updatedCustomerOrders.modifiedCount != 1)
    throw `Could not create an order for customer id ${customerId}`;

  // for each order item, find their associated seller and push orders to them
  const sellerOrders = {};
  await Promise.all(
    orderItems.forEach(async (listingId) => {
      const listing = await sellersData.getListingById(listingId);
      sellerOrders[listing.sellerId] = listing;
    })
  );

  // update seller order data
  for (const sellerId in sellerOrders) {
    const newOrd = {
      customerId: customerId,
      orderItems: sellerOrders[sellerId],
      shippingAddress: shippingAddress,
      cost: cost,
      orderDate: new Date(),
    };
    const updatedSellerOrders = await sellersCollection.updateOne(
      {
        _id: new ObjectId(sellerId),
      },
      {
        $push: { orders: newOrd },
      }
    );

    if (updatedSellerOrders.modifiedCount != 1)
      throw `Error while updating seller orders`;
  }

  // update to return customer's new order
  return await getCustomerOrder(customerId);
};

// optional
const deleteOrder = async (sellerId, orderId) => {};

export const orderDataFunctions = {
  getCustomerOrders,
  getCustomerOrder,
  getSellerOrders,
  getSellerOrder,
  createOrder,
};
