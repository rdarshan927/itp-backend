// index.js
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('morgan')
const app = express();

// import Route files here
const employeeRole = require('./routes/EmployeeRolesRoute');
const packingroutes = require('./routes/PackingRoute');
const ordersroutes = require('./routes/OrdersRoute');
const cart = require('./routes/CartRoute');
const stripepay = require('./routes/PaymentRoute');
const sheporaUsers = require('./routes/SheporaUsersRoutes');




// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// Connect to MongoDB
connectDB();

// Routes here
app.use('/api', employeeRole);
app.use('/api', packingroutes);
app.use('/api', cart);
app.use('/api', stripepay)
app.use('/api', sheporaUsers);
app.use('/api', ordersroutes);


// Serve static files from the public directory
// app.use(express.static(path.join(__dirname, 'public')));

if (process.env.NODE_ENV === 'production') {
  // In production, serve the frontend build files
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

module.exports = app;
