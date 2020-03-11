require('dotenv').config({path: './config.env'});
const mongoose = require('mongoose');
const fs = require('fs');
const Meal = require('../../models/mealModel');
const User = require('../../models/userModel');
const Order = require('../../models/orderModel');
const Review = require('../../models/reviewModel');

mongoose.connect(process.env.DATABASE_LOCAL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log('Connected to DB successfully!')
});

const meals = JSON.parse(fs.readFileSync(`${__dirname}/meals.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const orders = JSON.parse(fs.readFileSync(`${__dirname}/orders.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));

const importData = async () => {
    try {
        // await Meal.create(meals);
        // await User.create(users);
        // await Order.create(orders);
        await Review.create(reviews);
        console.log('Data imported successfully!');
    } catch (e) {
        console.error(e);
    }
    process.exit();
};

const deleteData = async () => {
    try {
        // await Meal.deleteMany();
        // await User.deleteMany();
        // await Order.deleteMany();
        await Review.deleteMany();
        console.log('Data deleted successfully!');
    } catch (e) {
        console.error(e);
    }
    process.exit();
};

if (process.argv[2] === '--import') importData();
else if (process.argv[2] === '--delete') deleteData();