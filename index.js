var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser');
//var cookieParser = require('cookie-parser');
//var passport = require('passport');
//var flash = require('connect-flash');
//var session = require('express-session');
//var cookieSession = require('cookie-session');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/*app.use(cookieParser('rawr'));
app.use(session({
    secret: 'rawr',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());*/

//app.use(session({secret: 'ssshhhhh'}));

//var LocalStrategy = require('passport-local').Strategy;
//require('./app/routes.js')(app, passport);

// expose this function to our app using module.exports



// need cookieParser middleware before we can do anything with cookies
/*app.use(cookieParser());

// set a cookie
app.use(function (req, res, next) {
  // check if client sent cookie
  var cookie = req.cookies.cookieName;
  if (cookie === undefined)
  {
    // no: set a new cookie
    var randomNumber=Math.random().toString();
    randomNumber=randomNumber.substring(2,randomNumber.length);
    res.cookie('cookieName',randomNumber, { maxAge: 900000, httpOnly: true });
    console.log('cookie created successfully');
  } 
  else
  {
    // yes, cookie was already present 
    console.log('cookie exists', cookie);
  } 
  next(); // <-- important!
});*/



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

connection.query('USE animalshelter');

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

app.get('/dog', function(request, response) {
	response.render('pages/dog');
});

app.get('/shelter', function(request, response) {
	response.render('pages/shelter');
});

app.post('/adopt_signup', function(request, response) {
	console.log("form submitted");
	//response.redirect('pages/find');
	
	var first_name			 = request.body.first_name;
	var last_name			 = request.body.last_name;
	var street				 = request.body.street;
	var city				 = request.body.city;
	var state				 = request.body.state;
	var zip					 = request.body.zip;
	var email				 = request.body.email;
	var phone				 = request.body.phone;
	var house_style			 = request.body.house_style;
	var has_fenced_yard		 = request.body.has_fenced_yard;
	var has_kids			 = request.body.has_kids;
	var has_other_pets		 = request.body.has_other_pets;
	var lifestyle_preference = request.body.lifestyle_preference;
	var personality			 = request.body.personality;
	
	var q_size, q_kids, q_pets, q_personality, q_energy, q_personality, q_energy;
	
	if(has_fenced_yard==="TRUE") {
		q_size = "";
	}
	else {
		q_size = "d.size<>'large'"; // no large dogs if they don't have a fenced yard
	}
	
	if(has_kids==="TRUE") {
		q_kids = "d.okay_with_kids='TRUE'"; // dog must be okay with kids
	}
	else {
		q_kids = "";
	}
	
	if(has_other_pets==="TRUE") {
		q_pets = "d.okay_with_other_pets='TRUE'"; // dog must be okay with other pets
	}
	else {
		q_pets = "";
	}
	
	if(personality==="sanguine") {
		q_personality = "d.personality!='independent'";
	}
	else if(personality==="choleric") {
		q_personality = "d.personality!='shy'";
	}
	else if(personality==="melancholic") {
		q_personality = "d.personality!='independent'";
	}
	else if(personality==="phlegmatic") {
		q_personality = "d.personality!='confident'";
	}
	else {
		console.log("personality: this shouldn't happen");
		q_personality = "";
	}
	
	if(lifestyle_preference==="active") {
		q_energy = "d.energy_level='high'";
	}
	else if(lifestyle_preference==="average") {
		q_energy = "d.energy_level='medium'";
	}
	else if(lifestyle_preference==="inactive") {
		q_energy = "d.energy_level='low'";
	}
	else {
		console.log("lifestyle_preference: this shouldn't happen");
		q_energy = "";
	}
	
	if(q_size==="" && q_kids==="" && q_pets==="") { // none of q_size, q_kids, q_pets
		connection.query("SELECT * FROM animalshelter.Dog d WHERE " + q_personality, function(err, rows) {
			response.render('pages/find', {r:rows});
		});
	}
	else if(q_size==="") { // q_kids and q_pets
		connection.query("SELECT * FROM animalshelter.Dog d WHERE " + q_kids + " AND " + q_pets + " AND " + q_personality + " AND " + q_energy, function(err, rows) {
			response.render('pages/find', {r:rows});
		});
	}
	else if(q_kids==="") { // q_size and q_pets
		connection.query("SELECT * FROM animalshelter.Dog d WHERE " + q_size + " AND " + q_pets + " AND " + q_personality + " AND " + q_energy, function(err, rows) {
			response.render('pages/find', {r:rows});
		});
	}
	else if(q_pets==="") { // q_size and q_kids
		connection.query("SELECT * FROM animalshelter.Dog d WHERE " + q_size + " AND " + q_kids + " AND " + q_personality + " AND " + q_energy, function(err, rows) {
			response.render('pages/find', {r:rows});
		});
	}
	else if(q_size!="" && q_kids!="" && q_pets!="") { // all of q_size, q_kids, q_pets
		connection.query("SELECT * FROM animalshelter.Dog d WHERE " + q_size + " AND " + q_kids + " AND " + q_pets + " AND " + q_personality + " AND " + q_energy, function(err, rows) {
			response.render('pages/find', {r:rows});
		});
	}
	else { // one of q_size, q_kids, q_pets
		connection.query("SELECT * FROM animalshelter.Dog d WHERE " + q_size + q_kids + q_pets + " AND " + q_personality + " AND " + q_energy, function(err, rows) {
			response.render('pages/find', {r:rows});
		});
	}
	
	/*var post  = {first_name: first_name, last_name: last_name, street: street, city: city, state: state, zip: zip, email: email, phone: phone, house_style, house_style, has_fenced_yard: has_fenced_yard, has_kids: has_kids, has_other_pets: has_other_pets, lifestyle_preference: lifestyle_preference, personality: personality};
	
	var query = connection.query('INSERT INTO Adopter SET ?', post, function(err, result) {
		if(err) throw err;
		//connection.end();
		
		
		
		var query = connection.query('SELECT * FROM Dog WHERE ', function(err, rows, fields) {
			response.render('pages/find', {r:rows});
		});
	});
	console.log(query.sql);*/
});

app.post('/', function(req, res) {
	console.log("test");
    res.send('Test input: ' + req.body.input);
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