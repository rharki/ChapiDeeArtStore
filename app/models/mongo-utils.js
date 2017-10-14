var mongoose = require('mongoose');

// var envir = 1; // 1 for local hosting
var envir = 2; // 2 for mlab db hosting

function mongooseConnect() {
    var envir = 2; // 1 for local hosting
    // var envir = 2; // 2 for mlab db hosting
    // console.log("Hi from ArtWebsite mongooseConnect!");
    // mongoose.Promise = global.Promise;
    // console.log("variable envir is " + envir);
    if (envir == 1) {
        console.log("connecting on localhost!");
        mongoose.connect('mongodb://localhost:27017/artwebsitedatabase');
    } else if (envir == 2) {
        console.log("connecting on mlab hosted db!");
        mongoose.connect('mongodb://backupadmin:Complex!123@ds113795.mlab.com:13795/chapideeartstore');
    }

    mongoose.connection
    .on('error', function(error) {
        console.log('Connection  Error: ', error);
        throw error;
    })
    .once('open', function() {
        console.log('Connection with the aliens has been made!');
        // done();
    });
}

module.exports = mongooseConnect;
