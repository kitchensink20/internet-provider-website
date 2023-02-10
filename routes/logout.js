const express = require('express');
const logoutRouter = express.Router();

logoutRouter.delete('/', (req, res) => {
    req.logOut((err) => {
        if(err) return next(err);

        res.redirect('/login');
    });
});

module.exports = logoutRouter;