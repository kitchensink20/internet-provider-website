const { default: mongoose } = require('mongoose');
const moongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    },
    active_services: {
        type: [moongoose.SchemaTypes.ObjectId],
        default: []
    }
});

const User = mongoose.model('User', userSchema, 'users');

async function createUser(user) {
    try {
        const newUser = new User(user);
        await newUser.save(); // method to save a new user in the db
        return newUser;
    } catch(error) {
        console.error(error);
        return error;
    }
}

function findUser(query) {
    let requestedUser = User.findOne(query).exec();
    return requestedUser;
}

async function addTariffToActives(userId, tariff){
    let result = await User.findByIdAndUpdate(userId, 
        { $push: { active_services: tariff._id },
        $inc: { balance: -tariff.price }},
        { new: true }).exec();
    return result;
}

async function deleteActiveTariff(userId, tariff){
    let result = await User.findByIdAndUpdate(userId, 
        { $pull: { active_services: tariff._id }},
        { new: true }).exec();
    return result;
}

async function topUpUserBalance(userId, moneyAmount){
    let result = await User.findByIdAndUpdate(userId, 
        { $inc: { balance: +moneyAmount }},
        { new: true }).exec();
    return result;
}

async function getAllUsers(){
    let allUsers = await User.find({});
    return allUsers; 
}

module.exports = { createUser, findUser, addTariffToActives, topUpUserBalance, deleteActiveTariff, getAllUsers }