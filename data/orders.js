/* TO-DO
* Orders -> likely to change to support payment info and shipping status
*/

const getCustomerOrders = async (customerId) { }

const getSellerOrders= async (sellerId) {}

const createOrder = async (customerId, shippingAddress, cost) {
    // interesting thing is we don't need the items as a param, as we can pull from the cart

    // clear the cart once order is created
}

// optional
const deleteOrder = async (sellerId, orderId)

export {getCustomerOrders}