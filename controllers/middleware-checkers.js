function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) // checks the user's session to see if the user has logged in and been granted access
        return next();

    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated())
        return res.redirect('/menu');

    next();
}

function isAdmin(req, res, next){
    if(req.session.passport.user.admin)
        return next();

    res.status(403).send('Access denied.');
}

function isActive(req, res, next){
    if(req.session.passport.user.active)
        return next();
        
    res.redirect("/menu/top-up-balance");
}

module.exports = { checkAuthenticated, checkNotAuthenticated, isAdmin, isActive }