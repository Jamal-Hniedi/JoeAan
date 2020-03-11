const mongoose = require('mongoose');
const slugify = require('slugify');

const schema = new mongoose.Schema({
        category: {
            type: String,
            required: [true, 'Meal must belong to a category!'],
        },
        name: {
            type: String,
            required: [true, 'Meal must have a name!'],
            trim: true
        },
        slug: String,
        price: {
            type: Number,
            required: [true, 'Meal must have a price!']
        },
        imageCover: {
            type: String,
            required: [true, 'Meal must have a cover!']
        },
        images: [String],
        description: {
            type: String,
            required: [true, 'Meal must have a description!'],
            trim: true
        },
        ratingsAverage: {
            type: Number,
            default: 0,
            min: [1, 'Rating must be above 1'],
            max: [5, 'Rating must be below 5'],
            set: value => Math.round(value * 10) / 10
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
            min: [0, 'Rating count must be above 0']
        },
        sideItems: [String],
        available: {
            type: Boolean,
            default: true
        }
    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
);

schema.index({slug: 1});
schema.index({location: '2dsphere'});

schema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'meal',
    localField: '_id'
});

schema.pre('save', function (next) {
    this.slug = slugify(this.name, {lower: true});
    next();
});

schema.pre(/\b(find|findOne)\b/, function (next) {
    this.find({available: true});
    next();
});

const Meal = mongoose.model('Meal', schema);
module.exports = Meal;