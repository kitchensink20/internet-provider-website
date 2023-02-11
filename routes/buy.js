const express = require('express');
const buyRouter = express.Router(); 
const users = require('../models/users');

buyRouter.post('/tariff', async (req, res) => {
    try{
        await users.addTariffToActives(req.session.passport.user.id, req.body);
        req.session.passport.user.balance -= req.body.price;
        req.session.save((error) => {
            if (error) 
                return res.status(500).send(error);
            
            res.status(200);
        });
    } catch (error) {
        console.error(error);
    }
});

module.exports = buyRouter;