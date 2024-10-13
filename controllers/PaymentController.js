const stripe = require('stripe')(process.env.STRIPE_SECRET);
const Invoice = require('../models/InvoiceModel');
const Order = require('../models/OrdersModel');
const PaymentData = require('../models/PaymentModel');
const UserModel = require('../models/SheporaUsersModel');
const mongoose = require('mongoose');


const handlePayment = async(req, res) => {
    const {products} = req.body;

    if (!products || !Array.isArray(products)) {
        return res.status(400).json({ error: "Invalid request, products are missing or not an array" });
    }

    let userId = req.params.id;

    const lineItems = products.map((product)=>({
        price_data:{
            currency:"lkr",
            product_data:{
                name:product.productName,
                images:[
                    product.productName === "Floral Fantasy"
                    ? "https://raw.githubusercontent.com/BanditBytes/image/refs/heads/main/Floral%20Fantasy.jpeg"
                    : product.productName === "Rose"
                    ? "https://raw.githubusercontent.com/BanditBytes/image/refs/heads/main/Rose.jpeg"
                    : product.productName === "Sunflower"
                    ? "https://raw.githubusercontent.com/BanditBytes/image/refs/heads/main/Sunflower.jpeg"
                    : product.productName === "Tulip Heaven"
                    ? "https://raw.githubusercontent.com/BanditBytes/image/refs/heads/main/Tulip%20Heaven.jpeg"
                    : product.productName === "White Daisy"
                    ? "https://raw.githubusercontent.com/BanditBytes/image/refs/heads/main/White%20Daisy.jpeg"
                    : product.productName === "Romance"
                    ? "https://raw.githubusercontent.com/BanditBytes/image/refs/heads/main/Romance.jpeg"
                    : product.productName === "Pink Rose"
                    ? "https://raw.githubusercontent.com/BanditBytes/image/refs/heads/main/Pink%20Rose.jpeg"
                    : product.productName === "Pink Rose Bouquet"
                    ? "https://raw.githubusercontent.com/BanditBytes/image/refs/heads/main/Pink%20Rose%20B.jpeg"
                    : "https://raw.githubusercontent.com/BanditBytes/image/refs/heads/main/loading.png"
                ]
            },
            unit_amount: Math.round(product.price * 100),
        },
        quantity:product.quantity
    }));

    // Generate a unique ID for this payment
    const uniqueId = String(new mongoose.Types.ObjectId());

    // Save the products and userID in the database
    await PaymentData.create({
        uniqueId,
        userID: userId,
        products: products
    });

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items:lineItems,
            mode:"payment",
            success_url:`http://localhost:3000/paymentsuccess?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:`http://localhost:3000/cancel?session_id={CHECKOUT_SESSION_ID}`,
            client_reference_id: userId,
            metadata: {
                uniqueId
            }
        })

        res.cookie('stripeSessionId', session.id, { httpOnly: true, secure: true }); // until login is done
        res.json({id:session.id})
    } catch(error){
        console.log("error creating stripe session", error);
        res.status(500).send('Internal server error');
    }
}

// Stripe webhook endpoint
const stripepay = async (req, res) => {
    console.log("came to stripepay");
    
    // Log raw body to debug if needed
    const rawBody = JSON.stringify(req.body);
    console.log('Raw body:', rawBody);
    
    // Extract event data directly from request body
    const data = req.body.data.object;
    const eventType = req.body.type;

    // Handle the event
    switch (eventType) {
        case 'checkout.session.completed':
            // function to save the invoice and order
            await handlePaymentSuccess(data);
            break;
        default:
            console.log(`Unhandled event type ${eventType}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
};

const generateInvoiceID = async () => {
    const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });
    if (lastInvoice) {
        const lastID = parseInt(lastInvoice.invoiceID.split('-')[1], 10);
        return `INV-${lastID + 1}`;
    }
    return 'INV-1000'; // Start with 1000 if there are no invoices
};

const generateOrderID = async () => {
    const lastOrder = await Order.findOne().sort({ createdAt: -1 });
    if (lastOrder) {
        const lastID = parseInt(lastOrder.orderID.split('-')[1], 10);
        return `ODR-${lastID + 1}`;
    }
    return 'ODR-1000'; // Start with 1000 if there are no invoices
};

const handlePaymentSuccess = async (session) => {
    try {
        const { id: stripeSessionId, amount_total: amountPaid, metadata } = session;
        console.log(stripeSessionId, metadata, amountPaid);
        
        const { uniqueId } = metadata;
        const email = session.client_reference_id;

        const paymentData = await PaymentData.findOne({ uniqueId });
        const receiverData = await UserModel.findOne({ email });
        console.log('this is the payment data : ', paymentData);

        if(!paymentData){
            console.error('Payment Data not found!');
            return;
        }

        const products = paymentData.products;
        const finalAmountPaid = amountPaid/100;
        const orderID = await generateOrderID();
        const contact = receiverData.receiverPhoneNumber;
        const add = receiverData.deliveryAddress;
        const name = receiverData.name;
        const userInfo = email + ", " + receiverData.name;

        // Create a new order
        console.log('came to payment success!')
        const newOrder = new Order({
            orderID: orderID,
            userEmail: email,
            receiverName: name,
            receiverContact: contact,
            receiverAddress: add,
            products: products,
            totalAmount: finalAmountPaid
        });

        const savedOrder = await newOrder.save();

        const paymentMethod = metadata.payment_method || 'Credit Card';
        const invoiceID = await generateInvoiceID();
        console.log(invoiceID);

        if (!invoiceID) {
            console.error('Failed to generate Invoice ID!');
            return;
        }

        const newInvoice = new Invoice({
            userID: session.client_reference_id,
            userInfo: userInfo,
            invoiceID: invoiceID,
            amountPaid: finalAmountPaid,
            paymentMethod: paymentMethod,
            stripeSessionID: stripeSessionId,
            items: products,
            orderID: orderID
        })

        const savedInvoice = await newInvoice.save();

        console.log('Order saved successfully:', savedOrder);
        console.log("Invoice saved succesfully:", savedInvoice);
    } catch (error) {
        console.error('Error saving order & invoice:', error);
    }
};

module.exports = { stripepay, handlePaymentSuccess, handlePayment };
