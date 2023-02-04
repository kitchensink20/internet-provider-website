const mongoose = require('mongoose');

const connectionURL = "mongodb+srv://alina_lyt:Nikol123@cluster0.yhfiya7.mongodb.net/?retryWrites=true&w=majority"; // database URL to connect with node.js

// using mongoose library to establish connection to the specified URL, option tells to use new URL parser
// the old URL parser has several limitations and new one offers full Unicode support*, 
// the ability to detect the correct port number and support for some other options**
mongoose.connect(connectionURL, { useNewUrlParser: true });

// to get reference to the exstablished connection
const db = mongoose.connection;

db.on('')

// checking connection errors
db.on('error', console.error.bind(console, 'Connection error: '));
// console.error - method that writes an error message to the console.
// The 'bind' method is used to add context to console object, the second 
// argument tells to put this message in the beginning of any connection errors messages.

module.exports = connectToDB;

// *Unicode support is the ability to handle characters and symbols from a variety of writing
// systems and scripts. With Unicode support you can store data in different scripts and 
// languages in a single db and retrieve them, regardless of the script or language used.
// **As example, 'authSource' option specifies that db should be used to authenticate the connection.
// example of such connection string: mongodb://<username>:<password>@<host>:<port>/<database>?authSource=<authSource>
// 'authSource' is the name of the db that should be used in this connection