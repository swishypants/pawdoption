var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
//var cookieSession = require('cookie-session');

var app = express();

app.use(cookieParser('rawr'));
app.use(session({
    secret: 'rawr',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

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

app.get('/about', function(request, response) {
	response.render('pages/about');
});

app.get('/find', function(request, response) {
	request.send(request);
	response.render('pages/find');
});

/*app.get('/login', function(request, response) {
	response.render('pages/login');
});

	app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/find', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));*/

app.get('/signup', function(request, response) {
	response.render('pages/signup');
});

app.get('/logout', function(request, response) {
	request.logout();
	response.redirect('/');
});

app.get('/adopt', function(request, response) {
	response.render('pages/adopt');
});

app.get('/foster', function(request, response) {
	response.render('pages/foster');
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
	var username			 = request.body.username;
	var password			 = request.body.password;
	
	var q_size, q_kids, q_pets, q_personality, q_energy;
	
	if(has_fenced_yard==="on") {
		has_fenced_yard = "TRUE";
		q_size = "";
	}
	else {
		has_fenced_yard = "FALSE";
		q_size = "d.size<>'large'"; // no large dogs if they don't have a fenced yard
	}
	if(has_kids==="on") {
		has_kids = "TRUE";
		q_kids = " AND d.okay_with_kids='TRUE'"; // dog must be okay with kids
	}
	else {
		has_kids = "FALSE";
		q_kids = "";
	}
	if(has_other_pets==="on") {
		has_other_pets = "TRUE";
		q_pets = " AND d.okay_with_other_pets='TRUE'"; // dog with be okay with other pets
	}
	else {
		has_other_pets = "FALSE";
		q_pets = "";
	}
	
	connection.query("SELECT * FROM animalshelter.Dog d", function(err, rows) {
		if(rows===undefined) {
			console.log("Empty");
		}
		response.render('pages/find', {r:rows});
	});
	
	
	
	/*if(has_kids === "TRUE") {
		if(has_other_pets === "TRUE") {
			if(has_fenced_yard === "FALSE") {
				connection.query('SELECT * FROM Dog WHERE okay_with_kids="TRUE" AND okay_with_pets="TRUE" AND size!="large"', function(err, rows, fields) {
					response.render('pages/find', {r:rows});
				});
			}
			else {
				connection.query('SELECT * FROM Dog WHERE okay_with_kids="TRUE" AND okay_with_pets="TRUE"', function(err, rows, fields) {
					response.render('pages/find', {r:rows});
				});
			}
		}
		
		else {
			if(has_fenced_yard === "FALSE") {
				connection.query('SELECT * FROM Dog WHERE okay_with_kids="TRUE" AND size!="large"', function(err, rows, fields) {
					response.render('pages/find', {r:rows});
				});
			}
			else {
				connection.query('SELECT * FROM Dog WHERE okay_with_kids="TRUE"', function(err, rows, fields) {
					response.render('pages/find', {r:rows});
				});
			}
		}
	}
	
	else {
		if(has_other_pets === "TRUE") {
			if(has_fenced_yard === "FALSE") {
				connection.query('SELECT * FROM Dog WHERE okay_with_pets="TRUE" AND size!="large"', function(err, rows, fields) {
					response.render('pages/find', {r:rows});
				});
			}
			else {
				connection.query('SELECT * FROM Dog WHERE okay_with_pets="TRUE"', function(err, rows, fields) {
					response.render('pages/find', {r:rows});
				});
			}
		}
		
		else {
			if(has_fenced_yard === "FALSE") {
				connection.query('SELECT * FROM Dog WHEREAND size!="large"', function(err, rows, fields) {
					response.render('pages/find', {r:rows});
				});
			}
			else {
				connection.query('SELECT * FROM Dog', function(err, rows, fields) {
					response.render('pages/find', {r:rows});
				});
			}
		}
	}*/
	
	
	
	//var post  = {first_name: first_name, last_name: last_name, street: street, city: city, state: state, zip: zip, email: email, phone: phone, house_style, house_style, has_fenced_yard: has_fenced_yard, has_kids: has_kids, has_other_pets: has_other_pets, lifestyle_preference: lifestyle_preference, personality: personality, username: username, password: password};

	var post  = {first_name: first_name, last_name: last_name, street: street, city: city, state: state, zip: zip, email: email, phone: phone, house_style, house_style, has_fenced_yard: has_fenced_yard, has_kids: has_kids, has_other_pets: has_other_pets, lifestyle_preference: lifestyle_preference, personality: personality, username: username, password: password};
	
	/*var query = connection.query('INSERT INTO Adopter SET ?', post, function(err, result) {
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