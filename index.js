var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'animalshelter.cqfes6my9qk1.us-east-1.rds.amazonaws.com',
	port: '3306',
	user: 'animalshelter',
	password: 'doggies1',
	database: 'animalshelter'
});
var app = express();

connection.connect(function(err){
	if(!err){
		console.log("Database is connected :D \n\n");
	}else{
		console.log("Error connecting database D: \n\n");
	}
});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/about', function(request, response) {
  response.render('pages/about');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});