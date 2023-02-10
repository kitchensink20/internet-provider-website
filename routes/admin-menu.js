const express = require('express');
const { checkAuthenticated } = require('../controllers/authentication-checker');
const { isAdmin } = require('../controllers/authorization-controller');
const path = require('path'); 
const bcrypt = require('bcrypt');
const users = require('../models/users');
const tariffes = require('../models/tariffes');
const adminMenuRouter = express.Router(); 

const saltRounds = 10; // the number of iterations the algorithm to hash password

adminMenuRouter.use(checkAuthenticated, isAdmin);

adminMenuRouter.get('/', (req, res) => {
    res.render(path.join(__dirname, '../views/pages/admin-menu-view.ejs'), { user: req.session.passport.user });
});

adminMenuRouter
    .route('/register-user')
    .get((req, res) => {
    res.render(path.join(__dirname, '../views/pages/register-view.ejs'), { error: null, user: req.session.passport.user });
    })
    .post(async (req, res) => {
    if(req.body.password !== req.body.passwordConfirm) 
        return res.render(path.join(__dirname, '../views/pages/register-view.ejs'), { error: 'Password was not confirmed successfully.', user: req.session.passport.user });

    try{
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        let user = {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            admin: req.body.admin == 'yes'? true: false
        };
        users.createUser(user);
        res.redirect('/');
    } catch {
        res.redirect('/register-user');
    }
});

adminMenuRouter
    .route('/create-tariff')
    .get((req, res) => {
    res.render(path.join(__dirname, '../views/pages/create-tariff-view.ejs'), { user: req.session.passport.user });
    })
    .post(async (req, res) => {
    try {
        let tariff = {
            type: req.body.type,
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        };
        tariffes.createTariff(tariff);
        res.redirect('/');
        fileManager.updateTariffesFile();
    } catch {
        res.redirect('/create-tariff');
    }
});

adminMenuRouter.get('/users-view', (req, res) => {
    res.render(path.join(__dirname, '../views/pages/admin-users-view.ejs'), { user: req.session.passport.user });
})

adminMenuRouter.get('/tariffes-view', (req, res) => {
    res.render(path.join(__dirname, '../views/pages/admin-tariffes-view.ejs'), { user: req.session.passport.user });
})

module.exports = adminMenuRouter;