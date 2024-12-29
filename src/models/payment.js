const mongoose = require('mongoose');

// Payment Schema
const PaymentSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    totalPrice: { 
        type: Number, 
        required: true 
    },
    orderItems: [
        {
            productId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Product', 
                required: true 
            },
            productName: { 
                type: String, 
                required: true 
            },
            productPrice: { 
                type: Number, 
                required: true 
            },
            quantity: { 
                type: Number, 
                required: true 
            }
        }
    ],
    // paymentStatus: { 
    //     type: String, 
    //     enum: ['Pending', 'Completed', 'Failed', 'Refunded'], 
    //     default: 'Pending'
    // },
    // paymentMethod: { 
    //     type: String, 
    //     enum: ['Credit Card', 'Debit Card', 'PayPal', 'Stripe', 'Other'],
    //     required: true 
    // },
    paymentDate: { 
        type: Date, 
        default: Date.now 
    },
    // paymentReference: { 
    //     type: String, 
    //     unique: true 
    // },
    // orderId: { 
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: 'Order', 
    //     //required: true 
    // },
    cartId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Cart', 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
