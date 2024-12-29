const mongoose=require("mongoose");
const newUser = mongoose.Schema({
    Name: {
        type: String,
        require: true
    },
    Age: {
        type: String,
        require: true
    },
    Password: {
        type: String,
        require: true
    },
    Confirm_password: {
        type: String,
        require: true
    },
    Email: {
        type: String,
        require: true
    },
    Contact: {
        type: String,
        require: true
    },
    Address: {
        type: String,
        default: 'Dummy_Address',
        require: true
    },
    // WILL TAKE THEM IN NEXT ITERATION
    // LandMark: {
    //     type: String,
    //     require: true
    // },
    // PIN: {
    //     type: String,
    //     require: true
    // },
    // State: {
    //     type: String,
    //     require: true
    // }
});
const User =  mongoose.model('User',newUser);
module.exports = User;