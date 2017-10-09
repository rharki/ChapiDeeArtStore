var mongoose = require('mongoose');
// var envir = 1; // 1 for local hosting
var envir = 2; // 2 for mlab db hosting

function mongooseConnect() {
    // console.log("Hi from ArtWebsite mongooseConnect!");
    mongoose.Promise = global.Promise;
    if (envir == 1) {
        mongoose.connect('mongodb://localhost:27017/artwebsitedatabase');
    } else if (envir == 2) {
        mongoose.connect('mongodb://admin321:Complex@321@ds113795.mlab.com:13795/chapideeartstore');
    }

    mongoose.connection
    .on('error', function(error) {
        console.log('Connection  Error: ', error);
        throw err;
    })
    .once('open', function() {
        console.log('Connection with the aliens has been made!');
        // done();
    });
}

module.exports = mongooseConnect;
