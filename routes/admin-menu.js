const express = require('express');
const { checkAuthenticated, isAdmin } = require('../controllers/middleware-checkers');
const path = require('path'); 
const bcrypt = require('bcrypt');
const users = require('../models/users');
const tariffes = require('../models/tariffes');
const adminMenuRouter = express.Router(); 
const fileManager = require('../controllers/tariffes-file-manager');

const saltRounds = 10; // the number of iterations the algorithm to hash password

adminMenuRouter.use(checkAuthenticated, isAdmin);

adminMenuRouter.get('/', (req, res) => {
    res.render(path.join(__dirname, '../views/pages/admin/admin-menu-view.ejs'), { user: req.session.passport.user });
});

adminMenuRouter
    .route('/register-user')
    .get((req, res) => {
        res.render(path.join(__dirname, '../views/pages/admin/admin-register-view.ejs'), { error: null, user: req.session.passport.user });
    })
    .post(async (req, res) => {
        if(req.body.password !== req.body.passwordConfirm) 
            return res.render(path.join(__dirname, '../views/pages/admin/admin-register-view.ejs'), { error: 'Password was not confirmed successfully.', user: req.session.passport.user });

        if(await users.findUser({ email: req.body.email }))
            return res.render(path.join(__dirname, '../views/pages/admin/admin-register-view.ejs'), { error: 'User with such email already excists.', user: req.session.passport.user });

        try{
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
            let user = {
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                admin: req.body.admin == 'yes'? true: false
            };
            users.createUser(user);
            res.redirect('/admin-menu/users-view');
        } catch {
            res.redirect('/register-user');
        }
    });

adminMenuRouter
    .route('/create-tariff')
    .get((req, res) => {
    res.render(path.join(__dirname, '../views/pages/admin/admin-create-tariff-view.ejs'), { user: req.session.passport.user });
    })
    .post(async (req, res) => {
    try {
        let tariff = {
            type: req.body.type,
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        };
        await tariffes.createTariff(tariff);
        fileManager.updateTariffesFile();
        
        res.redirect('/admin-menu/tariffes-view');
    } catch {
        res.redirect('/admin-menu/create-tariff');
    }
    });

adminMenuRouter
    .route('/top-up-balance')
    .get((req, res) => {
        res.render(path.join(__dirname, '../views/pages/admin/admin-top-up-balance-view.ejs'), { user: req.session.passport.user });
    })
    .post(async (req, res) => {
        let userId = req.session.passport.user.id;
        let plusMoney = Number(req.body.topUpMoney);
        await users.topUpUserBalance(userId, plusMoney);

        req.session.passport.user.balance += plusMoney;

        return res.redirect('/');
    });

adminMenuRouter
    .route('/my-active-tariffes')
    .get((req, res) => {
        res.render(path.join(__dirname, '../views/pages/admin/admin-my-active-tariffes-view.ejs'), { user: req.session.passport.user });
    });
    
adminMenuRouter.put('/my-active-tariffes/:tariffId', async (req, res) => {
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

adminMenuRouter.get('/users-view', (req, res) => {
    res.render(path.join(__dirname, '../views/pages/admin/admin-users-view.ejs'), { user: req.session.passport.user });
});

adminMenuRouter 
    .route("/users-view/block/:userId")
    .put((req, res) => {
        let chosenUser = req.body;
        users.blockUser(chosenUser._id);
    });

adminMenuRouter 
    .route("/users-view/unblock/:userId")
    .put((req, res) => {
        let chosenUser = req.body;
        users.unblockUser(chosenUser._id);
    });

adminMenuRouter.get('/tariffes-view', (req, res) => {
    res.render(path.join(__dirname, '../views/pages/admin/admin-tariffes-view.ejs'), { user: req.session.passport.user });
});

adminMenuRouter.delete('/tariffes-view/:tariffId', async (req, res) => {
    try{
        const tariff = req.body;

        await tariffes.deleteTariff(tariff);
        fileManager.updateTariffesFile();
    } catch (error) {
        console.error(error);
    }
});

adminMenuRouter
    .route('/tariffes-view/edit-tariff/:tariffId')
    .get(async (req, res) => {
        try {
            let tariffId = req.params.tariffId;
            let tariff = await tariffes.getTariffById(tariffId);
            res.render(path.join(__dirname, '../views/pages/admin/admin-edit-tariff-view.ejs'), { user: req.session.passport.user, tariff: tariff });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    }).put(async (req, res) => {
        try{
            let tariffId = req.params.tariffId;
            let updatedTariff = req.body;
            await tariffes.updateTariff(tariffId, updatedTariff);
            fileManager.updateTariffesFile();
            res.redirect('/admin-menu/tariffes-view');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
        }
    });

module.exports = adminMenuRouter;