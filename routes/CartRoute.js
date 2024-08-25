const { createCart, getCart, getSingleCart, updateCart, deleteCart } = require('../controllers/CartController')
const express = require('express')

const route = express.Router()

route.post('/cart/add', createCart)
route.get('/cart/get', getCart)
route.get('/cart/get/id/:id', getSingleCart)
route.patch('/cart/update/:id', updateCart)
route.delete('/cart/delete/:id', deleteCart)

module.exports = route