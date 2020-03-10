const mongoose = require('mongoose');
const validator = require('validator').default;
const bcrypt = require('bcryptjs');

const schema = new mongoose.Schema({
        username: {
            type: String,
            unique: [true, 'Username is taken! Please choose another one!'],
            required: [true, 'User must have a username'],
            trim: true
        },
        photo: String,
        email: {
            type: String,
            unique: [true, 'There\'s already a user with this email!'],
            required: [true, 'User must have an email!'],
            trim: true,
            validate: {
                validator: validator.isEmail,
                message: 'Invalid email!'
            }
        },
        role: {
            type: String,
            enum: {
                values: ['user', 'admin'],
                message: 'Role is either user or admin!'
            },
            default: 'user'
        },
        password: {
            type: String,
            required: [true, 'User must have a password!'],
            minlength: 8,
            select: false
        },
        passwordConfirm: {
            type: String,
            required: [true, 'User must have a passwordConfirm!'],
            validate: {
                validator: function (value) {
                    return value === this.password;
                },
                message: 'Passwords are not the same!'
            },
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
        active: {
            type: Boolean,
            default: true,
            select: false
        }
    }
);

/**
 * Encrypt password
 */
schema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.passwordConfirm = undefined;
    }
    next();
});

/**
 * Record when password is changed
 */
schema.pre('save', function (next) {
    if (this.isModified('password') && !this.isNew) {
        this.passwordChangedAt = Date.now() - 1000;
    }
    next();
});

/**
 * Find only active users
 */
schema.pre(/^find/, function (next) {
    this.find({active: true});
    next();
});


schema.methods.isPasswordCorrect = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};
schema.methods.passwordChangedAfter = function (JWTTimestamp) {
    if (!this.passwordChangedAt) return false;
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
};

const User = mongoose.model('User', schema);
module.exports = User;