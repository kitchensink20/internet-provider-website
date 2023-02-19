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

async function getTariffById(tariffId){
    let tariff = await Tariff.findById(tariffId).exec();
    return tariff;
}

function getAllTariffes(){
    let tariffesList = Tariff.find({}).exec();
    return tariffesList;
}

async function updateTariff(id, updatedTariff){
    try{
        await Tariff.findByIdAndUpdate(id, { type: updatedTariff.type, name: updatedTariff.name, description: updatedTariff.description, price: updatedTariff.price });
    } catch (error) {
        console.error(error);
        return error;
    }
}

async function deleteTariff(tariff){
    try {
        await Tariff.findByIdAndDelete(tariff._id);
    }
    catch (error) {
        console.error(error);
        return error;
    }
}

module.exports = { createTariff, getAllTariffes, deleteTariff, getTariffById, updateTariff }