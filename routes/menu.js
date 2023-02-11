const express = require('express');
const menuRouter = express.Router(); 
const path = require('path'); 
const { checkAuthenticated } = require('../controllers/authentication-checker');

menuRouter.use(checkAuthenticated);

menuRouter.get('/', (req, res) => {
    if(!req.session.passport.user.admin)
        res.render(path.join(__dirname, '../views/pages/user/user-menu-view.ejs'), { user: req.session.passport.user });
    else 
        res.redirect('/admin-menu');
});

module.exports = menuRouter;