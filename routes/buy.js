const express = require('express');
const buyRouter = express.Router(); 
const users = require('../models/users');

buyRouter.post('/tariff', async (req, res) => {
    try{
        await users.addTariffToActives(req.session.passport.user.id, req.body);
      //  console.log("User " + req.session.passport.user.username + " updated successfully!");
    } catch (error) {
        console.error(error);
    }
});

module.exports = buyRouter;