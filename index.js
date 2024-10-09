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
const Sales = require('./routes/SalesRoute')
const inventoryStuffPayment = require('./routes/InventoryStuffRoutes');
const EmployeeSalary = require('./routes/EmployeeSalaryRoute');
const packingroutes = require('./routes/PackingRoute');
const deliveryroutes = require('./routes/DeliveryRoute');
const ordersroutes = require('./routes/OrdersRoute');
const cart = require('./routes/CartRoute');
const stripepay = require('./routes/PaymentRoute');
const sheporaUsers = require('./routes/SheporaUsersRoutes');
const harvestData = require("./routes/HarvestRout");
const plantSchedule = require("./routes/PlantScheduleRoute")

const employeemanagement = require('./routes/EmployeeManaementRoutes');
const inventory = require('./routes/InventoryManagementRoute');
const summaryCardRoute = require('./routes/SummaryCardRoute');
const barchart = require('./routes/BarChartRoute'); 



// Middleware to parse JSON
app.use(express.json());

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(logger('dev'));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors())

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// Connect to MongoDB
connectDB();

// Routes here
app.use('/api', employeeRole);
app.use('/api', Sales);
app.use('/api', inventoryStuffPayment);
app.use('/api', EmployeeSalary);

app.use('/api', packingroutes);
app.use('/api', deliveryroutes);
app.use('/api', cart);
app.use('/api', stripepay);
app.use('/api', sheporaUsers);
app.use ('/harvest',harvestData)
app.use('/api', employeemanagement);
app.use('/api', inventory);
app.use('/api', ordersroutes);

app.use('/api', summaryCardRoute);
app.use('/api',barchart);
app.use('/plantSchedules', plantSchedule);

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
