var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var connection = mysql.createConnection({
	host: 'animalshelter.cqfes6my9qk1.us-east-1.rds.amazonaws.com',
	port: '3306',
	user: 'animalshelter',
	password: 'doggies1',
	database: 'animalshelter'
});


connection.connect(function(err){
	if(!err){
		console.log("Database is connected :D \n");
	}else{
		console.log("Error connecting database D: \n");
	}
});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.get('/', function(request, response) {
	response.render('pages/index');
});

app.get('/about', function(request, response) {
	response.render('pages/about');
});

app.get('/find', function(request, response) {
	response.render('pages/find');
});

app.get('/login', function(request, response) {
	response.render('pages/login');
});

app.get('/signup', function(request, response) {
	response.render('pages/signup');
});

app.get('/adopt', function(request, response) {
	response.render('pages/adopt');
});

app.get('/foster', function(request, response) {
	response.render('pages/foster');
});

app.post('adopt_signup', function(request, response) {
	console.log("POST WORKS");
	//response.render('/signup');
	//console.log(request.body.first_name);

});

function generate_random() {
	console.log("Button clicked");
	/*connection.query("SELECT * FROM Dog ORDER BY RANDOM() LIMIT 0,1", function(err, rows) {
		console.log("Connection opened");
		if(err) throw err;
		//connection.end()
		return {r:rows};
		connection.end();
		console.log("Connection closed");
	});*/
	document.getElementById("random_dog").innerHTML = "Hello World";
}