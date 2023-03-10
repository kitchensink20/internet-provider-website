const LocalStrategy = require('passport-local').Strategy; // creates a new instance of LocalStrategy class
const bcrypt = require('bcrypt');
const users = require('./users');

function initialize(passport){
    const authenticateUser = async (_email, _password, done) => {
        let user = await users.findUser({ email: _email });

        if(!user)
            return done(null, false, { message: 'No user with that email.' }); // done is a callback function that is called when authentication is complete

        if(await bcrypt.compare(_password, user.password)) { // bcrypt.compare is an asynchronous func, it uses 'await' to wait for the promise returned by 'compare' func to resolve
            if(!user.active && user.balance > 0)
                return done(null, false, { message: 'Your account has been banned by admin. Please contact support.' });
            return done(null, user); // as the resolved value is true, it calls the done with null as first argument(no errors in the code) and user object as second
        }   
        else 
            return done(null, false, { message: 'Password incorrect.' }); // false indicates error authentication
    }
    passport.use(new LocalStrategy({ usernameField: 'email' },  // defines authentication strategy, first option tells LocalStrategy to use email as the username when authenticating users
    authenticateUser)); // second argument is a func to perform the authentication itself
    // for authenticateUser arguments aren't provided, but they will be provided by the LocalStrategy when it calls the func later or during authentication process 
    passport.serializeUser((user, done) => { 
        const userData = {
            id: user._id,
            email: user.email,
            username: user.username,
            admin: user.admin,
            balance: user.balance,
            active: user.active,
            active_services: user.active_services
        }
        return done(null, userData); 
    }); // specifies how a user object should be stored in the session, done func with id as a second arg tells 'passport' to store user data exept for password
    passport.deserializeUser(async (userData, done) => { 
        let user = await users.findUser({ _id: userData.id })
        return done(null, user); }); // specifies how the user object should be retrieved from the session, it takes user's id 
}

module.exports = initialize;