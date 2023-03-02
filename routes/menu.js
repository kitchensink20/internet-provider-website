const express = require('express');
const menuRouter = express.Router(); 
const path = require('path'); 
const users = require('../models/users');
const { checkAuthenticated, isActive } = require('../controllers/middleware-checkers');

menuRouter.use(checkAuthenticated);

menuRouter.get('/', isActive, (req, res) => {
    if(!req.session.passport.user.admin)
        res.render(path.join(__dirname, '../views/pages/user/user-menu-view.ejs'), { user: req.session.passport.user });
    else 
        res.redirect('/admin-menu');
});

menuRouter
    .route('/my-active-tariffes')
    .get(isActive, (req, res) => {
        res.render(path.join(__dirname, '../views/pages/user/user-my-active-tariffes-view.ejs'), { user: req.session.passport.user });
    });
    
menuRouter.put('/my-active-tariffes/:tariffId', isActive, async (req, res) => {
    try{
        const tariff = req.body;
        await users.deleteActiveTariff(req.session.passport.user.id, tariff);

        let idxToDelete = req.session.passport.user.active_services.indexOf(tariff._id);
        req.session.passport.user.active_services.splice(idxToDelete, 1);
        req.session.save((error) => {
            if (error) 
                return res.status(500).send(error);
            
            res.status(200);
        });
    } catch (error) {
        console.error(error);
    }
});

menuRouter
    .route('/top-up-balance')
    .get((req, res) => {
        res.render(path.join(__dirname, '../views/pages/user/user-top-up-balance-view.ejs'), { user: req.session.passport.user });
    })
    .post(async (req, res) => {
        let userId = req.session.passport.user.id;
        let plusMoney = Number(req.body.topUpMoney);
        await users.topUpUserBalance(userId, plusMoney);

        req.session.passport.user.balance += plusMoney;

        if(req.session.passport.user.balance > 0 && !req.session.passport.user.active) {
            await users.unblockUser(req.session.passport.user.id);
            req.session.passport.user.active = true;
        }

        return res.redirect('/');
    });

module.exports = menuRouter;