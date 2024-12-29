//Serving OrderItem on CART in frontend


const mongoose = require('mongoose');
// const orderItemschema = mongoose.Schema({
//     Quantity: {
//         type: Number,
//         required: true
//     },
//     Product:{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product",
//         required: true
//     },
//     User: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     productName: {
//         type: String,
//         required: true
//     }
// });
const orderItemschema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId, // Assuming productId is a MongoDB ObjectId
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    productName: {
        type: String,
        default: 'Unknown Product'
    },
    productPrice: {
        type: Number,
        default: 0
    },
    productImage: {
        type: String,
        default: 'No Image Available'
    }
});

const OrderItem =  mongoose.model('OrderItem',orderItemschema);
module.exports = OrderItem;