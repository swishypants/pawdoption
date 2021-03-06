var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var mysql = require('mysql');
const { Client } = require('pg');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var connection = new Client({
	connectionString: process.env.DATABASE_URL,
});
/*
var connection = mysql.createConnection({
	host: process.env.host,
	port: process.env.port,
	user: process.env.user,
	password: process.env.password,
	database: process.env.database
});
*/

connection.connect(function(err){
	if(!err){
		console.log("Database is connected :D \n");
	}else{
		console.log("Error connecting database D: \n");
		console.log(err);
	}
});

//connection.query('USE animalshelter');

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

var dog_query = "SELECT * FROM Dog d";
var shelter_query = "SELECT * FROM Shelter s";

app.get('/dog', function(request, response) {
	connection.query(dog_query, function(err, result) {
		response.render('pages/dog', {r: result.rows});
	});
	
	// sort
	app.get('/sort-id', function(request, response) {
		connection.query(dog_query + " ORDER BY d.dog_id ASC", function(err, result) {
			response.render('pages/dog', {r:result.rows});
		});
	});
	
	app.get('/dog/sort-name', function(request, response) {
		connection.query(dog_query + " ORDER BY d.name ASC", function(err, result) {
			response.render('pages/dog', {r:result.rows});
		});
	});
	
	app.get('/dog/sort-age', function(request, response) {
		connection.query(dog_query + " ORDER BY d.age ASC", function(err, result) {
			response.render('pages/dog', {r:result.rows});
		});
	});
	
	app.get('/dog/sort-gender', function(request, response) {
		connection.query(dog_query + " ORDER BY d.gender ASC", function(err, result) {
			response.render('pages/dog', {r:result.rows});
		});
	});
	
	app.get('/dog/sort-breed', function(request, response) {
		connection.query(dog_query + " ORDER BY d.breed ASC", function(err, result) {
			response.render('pages/dog', {r:result.rows});
		});
	});
	
	app.get('/dog/sort-size', function(request, response) {
		connection.query(dog_query + " ORDER BY d.size DESC", function(err, result) {
			response.render('pages/dog', {r:result.rows});
		});
	});
	
	app.get('/dog/sort-coat', function(request, response) {
		connection.query(dog_query + " ORDER BY d.coat ASC", function(err, result) {
			response.render('pages/dog', {r:result.rows});
		});
	});
	
	app.get('/dog/sort-personality', function(request, response) {
		connection.query(dog_query + " ORDER BY d.personality ASC", function(err, result) {
			response.render('pages/dog', {r:result.rows});
		});
	});
	
	app.get('/dog/sort-energy', function(request, response) {
		connection.query(dog_query + " ORDER BY CASE WHEN d.energy_level = 'low' THEN 1 WHEN d.energy_level = 'medium' THEN 2 WHEN d.energy_level = 'high' THEN 3 ELSE 4 END", function(err, result) {
			response.render('pages/dog', {r:result.rows});
		});
	});
	
	app.get('/dog/sort-shelter', function(request, response) {
		connection.query(dog_query + " ORDER BY d.shelter_id ASC", function(err, result) {
			response.render('pages/dog', {r:result.rows});
		});
	});
});

app.get('/shelter', function(request, response) {
	connection.query(shelter_query, function(err, result) {
		response.render('pages/shelter', {r:result.rows});
	});
	
	// sort
	app.get('/shelter/sort-id', function(request, result) {
		connection.query(shelter_query + " ORDER BY s.shelter_id ASC", function(err, result) {
			response.render('pages/shelter', {r:result.rows});
		});
	});
	
	app.get('/shelter/sort-name', function(request, response) {
		connection.query(shelter_query + " ORDER BY s.shelter_name ASC", function(err, result) {
			response.render('pages/shelter', {r:result.rows});
		});
	});
	
	app.get('/shelter/sort-street', function(request, response) {
		connection.query(shelter_query + " ORDER BY s.street ASC", function(err, result) {
			response.render('pages/shelter', {r:result.rows});
		});
	});
	
	app.get('/shelter/sort-city', function(request, response) {
		connection.query(shelter_query + " ORDER BY s.city ASC", function(err, result) {
			response.render('pages/shelter', {r:result.rows});
		});
	});
	
	app.get('/shelter/sort-state', function(request, response) {
		connection.query(shelter_query + " ORDER BY s.state ASC", function(err, result) {
			response.render('pages/shelter', {r:result.rows});
		});
	});
	
	app.get('/shelter/sort-zip', function(request, response) {
		connection.query(shelter_query + " ORDER BY s.zip ASC", function(err, result) {
			response.render('pages/shelter', {r:result.rows});
		});
	});
	
	app.get('/shelter/sort-phone', function(request, response) {
		connection.query(shelter_query + " ORDER BY s.phone ASC", function(err, result) {
			response.render('pages/shelter', {r:result.rows});
		});
	});
});

app.get('/shelter_dogs/:shelter_id', function(request, response) {
	var id = request.params.shelter_id;
	var shelter_id_query = "SELECT * FROM Shelter s, Dog d WHERE s.shelter_id=d.shelter_id AND s.shelter_id = '" + id + "'";
	connection.query(shelter_id_query, function(err, result) {
		response.render('pages/shelter_dogs', {r:result.rows});
	});
	
	// sort
	app.get('/shelter_dogs/' + id + '/sort-id', function(request, response) {
		connection.query(shelter_id_query + " ORDER BY d.dog_id ASC", function(err, result) {
			response.render('pages/shelter_dogs', {r:result.rows});
		});
	});
	
	app.get('/shelter_dogs/' + id + '/sort-name', function(request, response) {
		connection.query(shelter_id_query + " ORDER BY d.name ASC", function(err, result) {
			response.render('pages/shelter_dogs', {r:result.rows});
		});
	});
	
	app.get('/shelter_dogs/' + id + '/sort-age', function(request, response) {
		connection.query(shelter_id_query + " ORDER BY d.age ASC", function(err, result) {
			response.render('pages/shelter_dogs', {r:result.rows});
		});
	});
	
	app.get('/shelter_dogs/' + id + '/sort-gender', function(request, response) {
		connection.query(shelter_id_query + " ORDER BY d.gender ASC", function(err, result) {
			response.render('pages/shelter_dogs', {r:result.rows});
		});
	});
	
	app.get('/shelter_dogs/' + id + '/sort-breed', function(request, response) {
		connection.query(shelter_id_query + " ORDER BY d.breed ASC", function(err, result) {
			response.render('pages/shelter_dogs', {r:result.rows});
		});
	});
	
	app.get('/shelter_dogs/' + id + '/sort-size', function(request, response) {
		connection.query(shelter_id_query + " ORDER BY d.size DESC", function(err, result) {
			response.render('pages/shelter_dogs', {r:result.rows});
		});
	});
	
	app.get('/shelter_dogs/' + id + '/sort-coat', function(request, response) {
		connection.query(shelter_id_query + " ORDER BY d.coat ASC", function(err, result) {
			response.render('pages/shelter_dogs', {r:result.rows});
		});
	});
	
	app.get('/shelter_dogs/' + id + '/sort-personality', function(request, response) {
		connection.query(shelter_id_query + " ORDER BY d.personality ASC", function(err, result) {
			response.render('pages/shelter_dogs', {r:result.rows});
		});
	});
	
	app.get('/shelter_dogs/' + id + '/sort-energy', function(request, response) {
		connection.query(shelter_id_query + " ORDER BY CASE WHEN d.energy_level = 'low' THEN 1 WHEN d.energy_level = 'medium' THEN 2 WHEN d.energy_level = 'high' THEN 3 ELSE 4 END", function(err, result) {
			response.render('pages/shelter_dogs', {r:result.rows});
		});
	});
	
	app.get('/shelter_dogs/' + id + '/sort-shelter', function(request, response) {
		connection.query(shelter_id_query + " ORDER BY d.shelter_id ASC", function(err, result) {
			response.render('pages/shelter_dogs', {r:result.rows});
		});
	});
});

app.post('/find', function(request, response) {
	console.log("form submitted");
	console.log(request)
	
	var house_style			 = request.body.house_style;
	var has_fenced_yard		 = request.body.has_fenced_yard;
	var has_kids			 = request.body.has_kids;
	var has_other_pets		 = request.body.has_other_pets;
	var lifestyle_preference = request.body.lifestyle_preference;
	var personality			 = request.body.personality;
	
	var q_size, q_kids, q_pets, q_personality, q_energy, q_personality, q_energy;
	
	q = "SELECT * FROM Dog d WHERE ";
	
	if(has_fenced_yard==="TRUE") {
		q_size = "";
	}
	else {
		q_size = "d.size<>'large'"; // no large dogs if they don't have a fenced yard
		q += q_size + " AND ";
	}
	
	if(has_kids==="TRUE") {
		q_kids = "d.okay_with_kids='TRUE'"; // dog must be okay with kids
		q += q_kids + " AND ";
	}
	else {
		q_kids = "";
	}
	
	if(has_other_pets==="TRUE") {
		q_pets = "d.okay_with_other_pets='TRUE'"; // dog must be okay with other pets
		q += q_pets + " AND ";
	}
	else {
		q_pets = "";
	}
	
	if(personality==="sanguine") {
		q_personality = "d.personality!='independent'";
		q += q_personality + " AND ";
	}
	else if(personality==="choleric") {
		q_personality = "d.personality!='shy'";
		q += q_personality + " AND ";
	}
	else if(personality==="melancholic") {
		q_personality = "d.personality!='independent'";
		q += q_personality + " AND ";
	}
	else if(personality==="phlegmatic" || personality==="null") {
		q_personality = "d.personality!='confident'";
		q += q_personality + " AND ";
	}
	else {
		console.log("personality: this shouldn't happen");
		q_personality = "";
	}
	
	if(lifestyle_preference==="active") {
		q_energy = "d.energy_level='high'";
		q += q_energy;
	}
	else if(lifestyle_preference==="average") {
		q_energy = "d.energy_level='medium'";
		q += q_energy;
	}
	else if(lifestyle_preference==="inactive" || lifestyle_preference==="null") {
		q_energy = "d.energy_level='low'";
		q += q_energy;
	}
	else {
		console.log("lifestyle_preference: this shouldn't happen");
		q_energy = "";
	}
	
	connection.query(q, function(err, result) {
		response.render('pages/find', {r:result.rows});
	});
	
	/*var post  = {first_name: first_name, last_name: last_name, street: street, city: city, state: state, zip: zip, email: email, phone: phone, house_style, house_style, has_fenced_yard: has_fenced_yard, has_kids: has_kids, has_other_pets: has_other_pets, lifestyle_preference: lifestyle_preference, personality: personality};
	
	var query = connection.query('INSERT INTO Adopter SET ?', post, function(err, result) {
		if(err) throw err;
		//connection.end();
		
		
		
		var query = connection.query('SELECT * FROM Dog WHERE ', function(err, result.rows, fields) {
			response.render('pages/find', {r:result.rows});
		});
	});
	console.log(query.sql);*/
	
	// sort find
	app.get('/find/sort-id', function(request, response) {
		connection.query(q + " ORDER BY d.dog_id ASC", function(err, result) {
			response.render('pages/find', {r:result.rows});
		});
	});

	app.get('/find/sort-name', function(request, response) {
		connection.query(q + " ORDER BY d.name ASC", function(err, result) {
			response.render('pages/find', {r:result.rows});
		});
	});

	app.get('/find/sort-age', function(request, response) {
		connection.query(q + " ORDER BY d.age ASC", function(err, result) {
			response.render('pages/find', {r:result.rows});
		});
	});

	app.get('/find/sort-gender', function(request, response) {
		connection.query(q + " ORDER BY d.gender ASC", function(err, result) {
			response.render('pages/find', {r:result.rows});
		});
	});

	app.get('/find/sort-breed', function(request, response) {
		connection.query(q + " ORDER BY d.breed ASC", function(err, result) {
			response.render('pages/find', {r:result.rows});
		});
	});

	app.get('/find/sort-size', function(request, response) {
		connection.query(q + " ORDER BY d.size DESC", function(err, result) {
			response.render('pages/find', {r:result.rows});
		});
	});

	app.get('/find/sort-coat', function(request, response) {
		connection.query(q + " ORDER BY d.coat ASC", function(err, result) {
			response.render('pages/find', {r:result.rows});
		});
	});

	app.get('/find/sort-personality', function(request, response) {
		connection.query(q + " ORDER BY d.personality ASC", function(err, result) {
			response.render('pages/find', {r:result.rows});
		});
	});

	app.get('/find/sort-energy', function(request, response) {
		connection.query(q + " ORDER BY CASE WHEN d.energy_level = 'low' THEN 1 WHEN d.energy_level = 'medium' THEN 2 WHEN d.energy_level = 'high' THEN 3 ELSE 4 END", function(err, result) {
			response.render('pages/find', {r:result.rows});
		});
	});

	app.get('/find/sort-shelter', function(request, response) {
		connection.query(q + " ORDER BY d.shelter_id ASC", function(err, result) {
			response.render('pages/find', {r:result.rows});
		});
	});
});
