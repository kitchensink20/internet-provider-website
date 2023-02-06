const express = require('express');
const router = express.Router(); // creates new instance of express router*
const { checkAuthenticated, checkNotAuthenticated } = require('./authentication-checker');
const initializePassport = require('./passport-config');
const path = require('path'); 
const bcrypt = require('bcrypt');
const passport = require('passport');
const users = require('../models/users');
const tariffes = require('../models/tariffes');
const { isAdmin } = require('./authorization-controller');
const fileManager = require('./tariffes-file-manager');

const saltRounds = 10; // the number of iterations the algorithm to hash password

initializePassport(passport);

/* requests to /login */

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render(path.join(__dirname, '../views/pages/login-view.ejs'));
}); 

router.post('/login', passport.authenticate('local', {
    successRedirect: '/', // if authentication successfull
    failureRedirect: '/login',  // if not
    failureFlash: true  // to display the error message on the login page
})); // the function is used to authenticate the user using the 'local' strategy

/* requests to /register-user */

router.get('/register-user', checkAuthenticated, isAdmin, (req, res) => {
    res.render(path.join(__dirname, '../views/pages/register-view.ejs'), { error: null, user: req.session.passport.user });
});

router.post('/register-user', async (req, res) => {
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

/* requests to /create-tariff */

router.get('/create-tariff', checkAuthenticated, isAdmin, (req, res) => {
    res.render(path.join(__dirname, '../views/pages/create-tariff-view.ejs'), { user: req.session.passport.user });
});

router.post('/create-tariff', async (req, res) => {
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

/* requests to / */

router.get('/', checkAuthenticated, (req, res) => {
    if(req.session.passport.user.admin)
        res.render(path.join(__dirname, '../views/pages/admin-menu-view.ejs'), { user: req.session.passport.user });
    else 
        res.render(path.join(__dirname, '../views/pages/user-menu-view.ejs'), { user: req.session.passport.user });
});

/* requests to /logout */

router.delete('/logout', (req, res) => {
    req.logOut((err) => {
        if(err) return next(err);

        res.redirect('/login');
    });
})

/* request to /tariffes-data */

router.get('/tariffes-data', function(req, res){
    tariffes.getAllTariffes().then(allTariffes => {
        res.json(allTariffes);
    }).catch(error => {
        console.error('Error: ', error);
    });
});

/* request to /download-tariffes */

router.get('/download-tariffes', (req, res) => {
    fileManager.downloadTariffes(res);
});

module.exports = router;

// *An express router allows you to define routes and handle HTTP requests in a modular way.
// A router acts as a middleware and can be used to handle specific requests for a particular part of your app.