const mongoose = require('mongoose');
const orderschema = mongoose.Schema({
    OrderItem: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required: true
    }],
    Address: {
        type: String,
        required: true
    },
    TotalPrice: {
        type: Number,
        default: 0
    },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    OrderedDate: {
        type: Date,
        default: Date.now
    }

});


const Order =  mongoose.model('Order',orderschema);
module.exports = Order;