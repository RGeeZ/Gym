const mongoose=require("mongoose");
const newProduct = mongoose.Schema({
    Name: {
        type: String,
        require: true
    },
    Description: {
        type: String,
        require: true},
    RichDescription: {
        type: String,
        require: true},
    Image: {
        type: String,
        require: true},
    Images: [{
        type: String,
        require: true}],
    Price: {
        type: Number,
        require: true},
    ItemCount: {
        type: Number,
        require: true},
    Rating: {
        type: Number,
        require: true},
    IsFeatured: {
        type: Boolean,
        require: true}
},{ collection: 'Test_Collection_Products' }
);
const Product = mongoose.model('Product',newProduct);
module.exports = Product;