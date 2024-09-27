const { createCart, getCart, getSingleCart, updateCart, deleteCart, getDelivery, updateDelivery } = require('../controllers/CartController')
const express = require('express')

const route = express.Router()

route.post('/cart/add', createCart)
route.get('/cart/get/:id', getCart)
route.get('/cart/get/id/:id', getSingleCart)
route.patch('/cart/update/:id', updateCart)
route.delete('/cart/delete/:id', deleteCart)
route.get('/cart/get/delivery/:id', getDelivery)
route.patch('/cart/update/delivery/:id', updateDelivery)

module.exports = route