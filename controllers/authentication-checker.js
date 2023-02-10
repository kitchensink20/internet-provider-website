function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) // checks the user's session to see if the user has logged in and been granted access
        return next();

    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) // checks the user's session to see if the user has logged in and been granted access
        return res.redirect('/menu');

    next();
}

module.exports = { checkAuthenticated, checkNotAuthenticated }