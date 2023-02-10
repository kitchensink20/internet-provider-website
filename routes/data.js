const express = require('express');
const dataRouter = express.Router();
const tariffes = require('../models/tariffes');

dataRouter.get('/tariffes', function(req, res){
    tariffes.getAllTariffes().then(allTariffes => {
        res.json(allTariffes);
    }).catch(error => {
        console.error('Error: ', error);
    });
});

module.exports = dataRouter;