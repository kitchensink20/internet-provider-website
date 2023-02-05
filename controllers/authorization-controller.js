function isAdmin(req, res, next){
    if(req.session.passport.user.admin)
        return next();

    res.status(403).send('Access denied.');
}

module.exports = { isAdmin }