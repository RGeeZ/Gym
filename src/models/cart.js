const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    address: { type: String, required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            productName: { type: String, required: true },
            productPrice: { type: Number, required: true },
            productImage: { type: String },
            quantity: { type: Number, required: true }
        }
    ],
    totalPrice: { type: Number, required: true },
    orderedDate: { type: Date, default: Date.now },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' } 
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
