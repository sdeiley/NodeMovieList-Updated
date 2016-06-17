var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var port = process.env.port || 1337;
var app = express();
var mongoOps = require('./server/MongoOperations.js');

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.get('/', function (request, response) {
	response.sendFile(path.join(__dirname, "/views/MoviesList.html"));
});

app.get('/api/movies', mongoOps.fetch);
app.post('/api/movies', mongoOps.add);
app.put('/api/movies/:movieId', mongoOps.modify);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port);
