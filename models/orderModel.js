const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Order must belong to a user!']
    },
    meals: [
        {
            meal: {
                type: mongoose.Schema.ObjectId,
                ref: 'Meal',
                required: [true, 'Order must have meals!']
            },
            quantity: {
                type: Number,
                min: [1, 'Meal quantity cannot be less than 1!'],
                default: 1
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    amount: {
        type: Number,
        required: [true, 'Order must have total amount!']
    }
});

schema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'username photo email createdAt'
    })
        .populate({
            path: 'meals.meal',
            select: 'name price'
        });
    next();
});

const Order = mongoose.model('Order', schema);
module.exports = Order;