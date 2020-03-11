const mongoose = require('mongoose');
const Meal = require('./mealModel');

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
        type: Number
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: [Number],
        address: String,
        description: String
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

schema.pre('save', async function (next) {
    const mealIds = this.meals.map(value => value.meal);
    const qs = this.meals.map(value => value.quantity);
    this.amount = 0;
    for (let i = 0; i < mealIds.length; i++) {
        const {price} = await Meal.findById(mealIds[i]);
        this.amount += price * qs[i];
    }
    next();
});

const Order = mongoose.model('Order', schema);
module.exports = Order;