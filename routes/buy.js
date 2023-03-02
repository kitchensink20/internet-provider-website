const express = require('express');
const buyRouter = express.Router(); 
const users = require('../models/users');

buyRouter.post('/tariff', async (req, res) => {
    try{
        await users.addTariffToActives(req.session.passport.user.id, req.body);

        req.session.passport.user.balance -= req.body.price;
        req.session.passport.user.active_services.push(req.body._id);
        req.session.save((error) => {
            if (error) 
                return res.status(500).send(error);
            
            res.status(200);
        });
        if(req.session.passport.user.balance < 0) {
            await users.blockUser(req.session.passport.user.id);
            req.session.passport.user.active = false;
            return res.redirect('/top-up-balance');
        }
    } catch (error) {
        console.error(error);
    }
});

module.exports = buyRouter;