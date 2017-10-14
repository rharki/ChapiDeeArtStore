var express = require('express');
var app = express();
var router = express.Router();
var fs = require('fs');
var appRoutes = require('./app/routes/api')(router);

var path = require('path');
var PORT = process.env.PORT || 8080;

var morgan = require('morgan');
app.use(morgan('dev'));

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing applications/JSON
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//handles all the static front-end routes
app.use(express.static(__dirname + '/public'));

//handles all api requests to http://localhost:3000/api/users
app.use('/api', appRoutes);

app.get('*', function(request, response) {
    response.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// Connect to Mongoose
var mongooseConnect = require('./app/models/mongo-utils');
mongooseConnect();

app.listen(PORT, function() {
    console.log("Chapi Dee Art Website is Alive, Kicking & Listening on port " + PORT);
});
