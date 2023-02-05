const moongoose = require('mongoose');

const tariffSchema = new moongoose.Schema({
    type: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const Tariff = moongoose.model('Tariff', tariffSchema, 'tariffes');

async function createTariff(tariff) {
    try {
        const newTariff = new Tariff(tariff);
        await newTariff.save();
        return newTariff;
    } catch(error) {
        console.error(error);
        return error;
    }
}

function  getAllTariffes(){
    let tariffesList = Tariff.find({}).exec();
    return tariffesList;
}

module.exports = { createTariff, getAllTariffes }