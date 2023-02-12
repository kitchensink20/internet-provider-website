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

dataRouter.get('/user', function(req, res){
    res.json(req.session.passport.user);
});

module.exports = dataRouter;