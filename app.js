//---------------------------------- Dependencies from node -----------------------------------//
const express = require('express');
const app = express();
const router= express.Router();
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose');
const path=require("path");
const {json}=require("express");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const cookieparser=require("cookie-parser");
const hbs=require('hbs');
const {urlencoded}=require("body-parser");
// const { static } = require("express");
const session = require('express-session');
const { dirname } = require("path");
const PORT = process.env.PORT || 3000;
const User = require('./src/models/user');
const OrderItem = require('./src/models/orderitem');
const Order = require('./src/models/order');
const Product = require('./src/models/product');
const Payment = require('./src/models/payment.js')
const Cart = require('./src/models/cart');
const templates_path = path.join(__dirname,'./src/template/views');
const cors = require('cors');
const { populate } = require('dotenv');
app.use(cors());



const { authenticationMiddleware, sessionMiddleware, Authenticated, isAuthenticated } = require('./src/middleware/middleware');


console.log(templates_path);
//------------------------------------- Taking all the required things -----------------------------------//
require('dotenv/config');   //CHECK THIS WHY IT IS BEIGN USED//
require('./src/db/connection');



app.use(cookieparser());
app.use(urlencoded({extended:false}));
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname,'./src/public')));
app.set('view engine','hbs');
app.set('views',templates_path);
app.use(sessionMiddleware);
app.use(authenticationMiddleware)


//------------------------------------Routes--------------------------------------//
//WILL TAKE FOR FUTURE//
// AS I have to put all the routing under different files//


const homeRoutes = require('./src/routes/home');
const user = require('./src/routes/user');
const loginRoutes = require('./src/routes/login');
const signupRoutes = require('./src/routes/signup');
const productRoutes = require('./src/routes/product');
const cartRoutes = require('./src/routes/cart');
const payment = require('./src/routes/payment');
const forgotPasswordRoutes = require('./src/routes/forgotPassword');

//--------------------------------------Routing------------------------------------//


app.use('/', homeRoutes);
app.use('/', loginRoutes);
app.use('/', signupRoutes);
app.use('/', productRoutes);
app.use('/', cartRoutes);
app.use('/', forgotPasswordRoutes);
app.use('/', user);
app.use('/', payment);

//-------------------------------------SERVER----------------------------------------//
// app.listen(PORT,(req,res)=>{
//     // console.log(`${PORT} is running for server`);
// })


if (require.main === module) {
    try {
        app.listen(PORT, (req,res) => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        res.status(400);
        console.error('Error starting server:', error);
        process.exit(1);  // Exit the process if server fails to start
    }
}




module.exports = app;