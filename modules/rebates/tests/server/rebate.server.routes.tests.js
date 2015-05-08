'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Rebate = mongoose.model('Rebate'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, rebate;

/**
 * Rebate routes tests
 */
describe('Rebate CRUD tests', function() {
	before(function(done) {
		// Get application
		app = express.init(mongoose);
		agent = request.agent(app);

		done();
	});

	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Rebate
		user.save(function() {
			rebate = {
				name: 'Rebate Name'
			};

			done();
		});
	});

	it('should be able to save Rebate instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Rebate
				agent.post('/api/rebates')
					.send(rebate)
					.expect(200)
					.end(function(rebateSaveErr, rebateSaveRes) {
						// Handle Rebate save error
						if (rebateSaveErr) done(rebateSaveErr);

						// Get a list of Rebates
						agent.get('/api/rebates')
							.end(function(rebatesGetErr, rebatesGetRes) {
								// Handle Rebate save error
								if (rebatesGetErr) done(rebatesGetErr);

								// Get Rebates list
								var rebates = rebatesGetRes.body;

								// Set assertions
								(rebates[0].user._id).should.equal(userId);
								(rebates[0].name).should.match('Rebate Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Rebate instance if not logged in', function(done) {
		agent.post('/api/rebates')
			.send(rebate)
			.expect(403)
			.end(function(rebateSaveErr, rebateSaveRes) {
				// Call the assertion callback
				done(rebateSaveErr);
			});
	});

	it('should not be able to save Rebate instance if no name is provided', function(done) {
		// Invalidate name field
		rebate.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Rebate
				agent.post('/api/rebates')
					.send(rebate)
					.expect(400)
					.end(function(rebateSaveErr, rebateSaveRes) {
						// Set message assertion
						(rebateSaveRes.body.message).should.match('Please fill Rebate name');
						
						// Handle Rebate save error
						done(rebateSaveErr);
					});
			});
	});

	it('should be able to update Rebate instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Rebate
				agent.post('/api/rebates')
					.send(rebate)
					.expect(200)
					.end(function(rebateSaveErr, rebateSaveRes) {
						// Handle Rebate save error
						if (rebateSaveErr) done(rebateSaveErr);

						// Update Rebate name
						rebate.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Rebate
						agent.put('/api/rebates/' + rebateSaveRes.body._id)
							.send(rebate)
							.expect(200)
							.end(function(rebateUpdateErr, rebateUpdateRes) {
								// Handle Rebate update error
								if (rebateUpdateErr) done(rebateUpdateErr);

								// Set assertions
								(rebateUpdateRes.body._id).should.equal(rebateSaveRes.body._id);
								(rebateUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Rebates if not signed in', function(done) {
		// Create new Rebate model instance
		var rebateObj = new Rebate(rebate);

		// Save the Rebate
		rebateObj.save(function() {
			// Request Rebates
			request(app).get('/api/rebates')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Rebate if not signed in', function(done) {
		// Create new Rebate model instance
		var rebateObj = new Rebate(rebate);

		// Save the Rebate
		rebateObj.save(function() {
			request(app).get('/api/rebates/' + rebateObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', rebate.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Rebate instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Rebate
				agent.post('/api/rebates')
					.send(rebate)
					.expect(200)
					.end(function(rebateSaveErr, rebateSaveRes) {
						// Handle Rebate save error
						if (rebateSaveErr) done(rebateSaveErr);

						// Delete existing Rebate
						agent.delete('/api/rebates/' + rebateSaveRes.body._id)
							.send(rebate)
							.expect(200)
							.end(function(rebateDeleteErr, rebateDeleteRes) {
								// Handle Rebate error error
								if (rebateDeleteErr) done(rebateDeleteErr);

								// Set assertions
								(rebateDeleteRes.body._id).should.equal(rebateSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Rebate instance if not signed in', function(done) {
		// Set Rebate user 
		rebate.user = user;

		// Create new Rebate model instance
		var rebateObj = new Rebate(rebate);

		// Save the Rebate
		rebateObj.save(function() {
			// Try deleting Rebate
			request(app).delete('/api/rebates/' + rebateObj._id)
			.expect(403)
			.end(function(rebateDeleteErr, rebateDeleteRes) {
				// Set message assertion
				(rebateDeleteRes.body.message).should.match('User is not authorized');

				// Handle Rebate error error
				done(rebateDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Rebate.remove().exec(function(){
				done();
			});
		});
	});
});
