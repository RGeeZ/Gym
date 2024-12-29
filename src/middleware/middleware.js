

const jwt = require('jsonwebtoken');
const session = require('express-session');

require('dotenv/config');

const authenticationMiddleware =(req, res, next) => {
    
    res.header('Access-Control-Allow-Origin', '*');  // Or specific origins
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Requested-With');
    
    
    // Exclude certain routes from the middleware
    const publicRoutes = ['/login', '/', '/product', '/signup','/api/product','/add-to-cart', '/ForgotPassword', '/forgot-password'
    ]; // Add any other public routes here
    if (publicRoutes.includes(req.path)) {
        return next();
    }

    console.log('Cookies:', req.cookies); // Debugging cookies
    const token = req.cookies.token; // Replace `token` with the actual key name
    console.log(`Request received: ${req.method} ${req.url}`);

    if (!token) {
        console.warn('No token found in cookies');
        return res.redirect('/login'); // Redirect to login if token is missing
    }

    next(); // Proceed to the next middleware or route handler
}


const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set true in production
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
});


function isAuthenticated(req) {
    const token = req.cookies.token;
    if (!token) {
        console.log("No token found in cookies");
        return false;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log("Token verified successfully:", decoded);
        return true;
    } catch (error) {
        console.error("Error verifying token:", error);
        return false;
    }
}
async function Authenticated(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        console.log("No token found in cookies");
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // Verify token asynchronously
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to the request object
        console.log("Token verified successfully:", decoded);
        next(); // Proceed to the next middleware/route handler
    } catch (error) {
        console.error("Error verifying token:", error);
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
}


module.exports = {
    authenticationMiddleware,
    sessionMiddleware,
    Authenticated,
    isAuthenticated
};