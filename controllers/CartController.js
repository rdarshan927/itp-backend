const CartModel = require('../models/CartModel')
const UserModel = require('../models/SheporaUsersModel')
const mongoose = require('mongoose')

const createCart = async(req, res) => {
    try {
        const { productID, productName, quantity, price, image, userEmail } = req.body;
        const alreadyExist = await CartModel.findOne({productID});

        if (alreadyExist){
            return res.status(400).json({message: 'Product has been already added to Cart!'});
        }

        const newCart = new CartModel({
            productID, productName, quantity, price, image, userEmail
        });

        await newCart.save();
        return res.status(201).json({message: 'Product has been added succesfully.'});
    } catch(error) {
        res.status(500).json({message: 'Product have not been added successfuly'});
        console.log(error);
    }   
}

const getCart = async(req, res) => {
    console.log('getCart endpoint hit!');
    const userEmail = req.params.id;
    console.log(userEmail);
    try {
        const carts = await CartModel.find({userEmail: userEmail});
        res.status(200).json(carts);
    } catch (error){
        res.status(500).json({message: 'There was an error while reading Cart!'});
        console.log(error);
    }
}

const getDelivery = async(req, res) => {
    const userEmail = req.params.id;
    console.log('Delivery : ', userEmail);
    try {
        const delivery = await UserModel.find({email: userEmail}).select('deliveryAddress receiverPhoneNumber');
        res.status(200).json(delivery);
    } catch (error){
        res.status(500).json({message: 'There was an error while reading delivery details!'});
        console.log(error);
    }
}

const getSingleCart = async(req, res) => {
    try {
        const cart = await CartModel.findById(req.params.id);

        if(!cart) {
            return res.status(404).json({message: 'There are no any cart that matches your ID!'});
        }
        res.status(200).json(cart);
    } catch(error){
        res.status(500).json({message: 'There was an internal error occured!'});
        console.log(error);
    }
}

const updateCart = async(req, res) => {
    try {
        const cartId = req.params.id;
        if (!cartId) {
            return res.status(400).json({ message: 'Cart ID is required' });
        }

        const { quantity } = req.body;

        if (!quantity) {
            console.log('missing field')
            return res.status(400).json({ message: 'There were few fields missing in the response!' });
        }

        if (typeof quantity !== 'number' || quantity <= 0) {
            console.log('quantity error')
            return res.status(400).json({ message: 'Quantity must be a positive number' });
        }

        const found = await CartModel.findById(cartId);

        if (!found) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        
        found.quantity = quantity;

        try {
            await found.save();
            res.status(200).json(found);
        } catch (error) {
            res.status(500).json({ message: 'Error updating cart' });
            console.log(error);
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal error occured!' });
        console.log(error);
    }
}

const deleteCart = async(req, res) => {
    try {
        const cartId = req.params.id;

        if(!mongoose.Types.ObjectId.isValid(cartId)) {
            return res.status(404).json({error: 'The ID provided isn\'t a valid one!'})
        }

        if(!cartId) {
            return res.status(400).json({message: 'Cart ID is requirred!'});
        }

        const existCart = await CartModel.findByIdAndDelete(cartId);
        console.log(existCart, ' somthing going on ', cartId);

        if(!existCart){
            return res.status(400).json({message: 'Cart not found!'});
        }

        res.status(200).json(existCart);
    } catch(error) {
        res.status(500).json({message: 'There was an error while deleting the cart!'});
    }
}

const updateDelivery = async (req, res) => {
    try {
        const email = req.params.id;
        const {receiverPhoneNumber, deliveryAddress} = req.body;

        const response = await UserModel.findOneAndUpdate(
            { email },
            { 
                receiverPhoneNumber, 
                deliveryAddress
            },
            { new: true } 
        );

        if (!response) {
            return res.status(400).json({ message: 'User doesn\'t exist!' });
        }

        res.status(200).json(response);
        console.log("success", response);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'There was an error while updating the delivery details!' });
    }
}

module.exports = { createCart, getCart, getSingleCart, updateCart, deleteCart, getDelivery, updateDelivery } 