const factory = require('./handlerFactory');
const Order = require('../models/orderModel');

exports.getAllOrders = factory.getAll(Order);
exports.getOrder = factory.getOneById(Order);
exports.createOrder = factory.createOne(Order);