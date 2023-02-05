const express = require('express'); 
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const router = require('./controllers/routes');
const db = require('./models/db-connection');

const app = express(); // creates instance of node js app
const port = 7070; // sets the number of the port for the server

db.once('open', () => {
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
app.use(router);

app.listen(port, () => 
    console.log('Server started on port ' + port + '.')); 

});