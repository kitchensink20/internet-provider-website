const mongoose = require('mongoose');

const connectionURL = "mongodb+srv://alina_lyt:12345@cluster0.yhfiya7.mongodb.net/internet_provider_website?retryWrites=true&w=majority/"; // database URL to connect with node.js

// using mongoose library to establish connection to the specified URL, first option tells to use new URL parser
// the old URL parser has several limitations and new one offers full Unicode support*, 
// the ability to detect the correct port number and support for some other options**
mongoose.connect(connectionURL, { 
    useNewUrlParser: true,
    useUnifiedTopology: true, //enables the new unified topilogy layer**** that improves connection stability and error handling
    w: 'majority', // requires that the data write is acknowkegded by the majority of nodes in the replica set
    j: true // provides journaling to ensure that write operations are durable and survive if system craches or restarts
 });

// to get reference to the established connection
const db = mongoose.connection;

//when the connection to db was successfully opened
db.once('open', () => console.log('Connection to DB established.'));

// checking connection errors
db.on('error', console.error.bind(console, 'DB connection error: '));
// console.error - method that writes an error message to the console.
// The 'bind' method is used to add context to console object, the second 
// argument tells to put this message in the beginning of any connection errors messages.

// when the db connection is dicconnected, more methods***
db.on('disconnected', () => {
    console.log('The connection to db was stopped.')
})

module.exports = db;

// *Unicode support is the ability to handle characters and symbols from a variety of writing
// systems and scripts. With Unicode support you can store data in different scripts and 
// languages in a single db and retrieve them, regardless of the script or language used.
// **As example, 'authSource' option specifies that db should be used to authenticate the connection.
// example of such connection string: mongodb://<username>:<password>@<host>:<port>/<database>?authSource=<authSource>
// 'authSource' is the name of the db that should be used in this connection
// ***more event methods with db:
// -db.on('all', callback) - for all events
// -db.on('connected', callback) -checks if the connection ws successful
// -db.on('fullsetup', callback) - when all models have been registered and connection to the db in open
// -db.on('reconnected', callback) - when the db connection is successfully reconnected
// ****The topology layer is part of MongoDB driver that abstracts the underlying network architecture and
// communiction with the MongoDB server.