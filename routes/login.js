const express = require('express');
const { checkNotAuthenticated } = require('../controllers/middleware-checkers');
const passport = require('passport');
const path = require('path');
const loginRouter = express.Router(); // creates new instance of express router*

loginRouter.use(checkNotAuthenticated);

loginRouter
    .route('/')
    .get((req, res) => {
        res.render(path.join(__dirname, '../views/pages/login-view.ejs'));
    })
    .post(passport.authenticate('local', {
        successRedirect: '/menu', // if authentication successfull
        failureRedirect: '/',  // if not
        failureFlash: true  // to display the error message on the login page
})); // the function is used to authenticate the user using the 'local' strategy

module.exports = loginRouter;

// *An express router allows you to define routes and handle HTTP requests in a modular way.
// A router acts as a middleware and can be used to handle specific requests for a particular part of your app.