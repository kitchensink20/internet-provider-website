const express = require('express'); 
const path = require('path'); 
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const initializePassport = require('./controllers/passport-config');
const { checkAuthenticated, checkNotAuthenticated } = require('./controllers/authenticationChecker');
//const db = require('./models/db-connection');

initializePassport(passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);

const users= [];

const app = express(); // creates instance of node js app
const port = 7070; // sets the number of the port for the server
const saltRounds = 10; // the number of iterations the algorithm to hash password

app.set('view-engine', 'ejs'); // tells express to use ejs as the default template engine

app.use(express.static(__dirname)); // middleware to use static files as well, the parameter specifies the directory to take files from
app.use(express.urlencoded({ extended: false })); // to parse the request bodies as URL-encoded data, the option means that the data will be parsed using the querystring library
app.use(flash()); // to store messages in the session thet are intended to be displayedd on the next request
app.use(session({
    secret: 'sjnlrlg13jn', // to sign the session ID cookie
    resave: false, // to resave session if it wasn't modified
    saveUninitialized: false // to save an unitialized session
})); // creates a session store on the server, allows to maintain state between HTTP requests
app.use(passport.initialize()); // to initialize passport and set up necessary data structures for aithentication
app.use(passport.session()); // to restore user authentication info from a previously established session
app.use(methodOverride('_method')); // tells the app to look for an HTTP request parameter named '_method' to determine the actual HTTP method to use for the request

app.get('/login', (req, res) => {
    res.render(path.join(__dirname, 'views/pages/login-view.ejs'));
}); 

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/', // if authentication successfull
    failureRedirect: '/login',  // if not
    failureFlash: true  // to display the error message on the login page
})); // the function is used to authenticate the user using the 'local' strategy

app.get('/register-user', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/pages/register-view.html'));
});

app.post('/register-user', async (req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        users.push({
            id: Date.now().toString(),
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            balance: 0,
            admin: req.body.admin=='yes'? true: false
        })
        res.redirect('/login');
    } catch {
        res.redirect('/register-user');
    }
    console.log(users);
});

app.get('/', checkAuthenticated, (req, res) => {
    res.render(path.join(__dirname, 'views/pages/admin-menu-view.ejs'), { username: req.body.username, balance: req.body.balance }) 
});

app.delete('/logout', (req, res) => {
    req.logOut((err) => {
        if(err) return next(err);

        res.redirect('/login');
    });
})

app.listen(port, () => 
    console.log('Server started on port ' + port + '.')); 
