const express = require('express');
const dataRouter = express.Router();
const tariffes = require('../models/tariffes');
const users = require('../models/users');

dataRouter.get('/tariffes', (req, res) => {
    tariffes.getAllTariffes().then(allTariffes => {
        res.json(allTariffes);
    }).catch(error => {
        console.error('Error: ', error);
    });
});

dataRouter.get('/user', (req, res) => {
    res.json(req.session.passport.user);
});

dataRouter.get('/users', async (req, res) => {
    try {
        let allUsers = await users.getAllUsers();
        res.json(allUsers);
    } catch (error) {
        console.error("Error: ", error);
    }
});

module.exports = dataRouter;