const MongoStore = require('connect-mongo');

const sessionStore = new MongoStore({
    mongoUrl: 'mongodb+srv://alina_lyt:12345@cluster0.yhfiya7.mongodb.net/internet_provider_website?retryWrites=true',
    collection: 'sessions', // collection name in mongoDB
    expires: 1000 * 60 * 60 * 24 * 7 // expires in a week
});

// error checker
sessionStore.on('error', function(error) {
    console.log(error);
});
  
module.exports = sessionStore;