'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Affiliate = mongoose.model('Affiliate'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, affiliate;

/**
 * Affiliate routes tests
 */
describe('Affiliate CRUD tests', function() {
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

		// Save a user to the test db and create new Affiliate
		user.save(function() {
			affiliate = {
				name: 'Affiliate Name'
			};

			done();
		});
	});

	it('should be able to save Affiliate instance if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Affiliate
				agent.post('/api/affiliates')
					.send(affiliate)
					.expect(200)
					.end(function(affiliateSaveErr, affiliateSaveRes) {
						// Handle Affiliate save error
						if (affiliateSaveErr) done(affiliateSaveErr);

						// Get a list of Affiliates
						agent.get('/api/affiliates')
							.end(function(affiliatesGetErr, affiliatesGetRes) {
								// Handle Affiliate save error
								if (affiliatesGetErr) done(affiliatesGetErr);

								// Get Affiliates list
								var affiliates = affiliatesGetRes.body;

								// Set assertions
								(affiliates[0].user._id).should.equal(userId);
								(affiliates[0].name).should.match('Affiliate Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Affiliate instance if not logged in', function(done) {
		agent.post('/api/affiliates')
			.send(affiliate)
			.expect(403)
			.end(function(affiliateSaveErr, affiliateSaveRes) {
				// Call the assertion callback
				done(affiliateSaveErr);
			});
	});

	it('should not be able to save Affiliate instance if no name is provided', function(done) {
		// Invalidate name field
		affiliate.name = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Affiliate
				agent.post('/api/affiliates')
					.send(affiliate)
					.expect(400)
					.end(function(affiliateSaveErr, affiliateSaveRes) {
						// Set message assertion
						(affiliateSaveRes.body.message).should.match('Please fill Affiliate name');
						
						// Handle Affiliate save error
						done(affiliateSaveErr);
					});
			});
	});

	it('should be able to update Affiliate instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Affiliate
				agent.post('/api/affiliates')
					.send(affiliate)
					.expect(200)
					.end(function(affiliateSaveErr, affiliateSaveRes) {
						// Handle Affiliate save error
						if (affiliateSaveErr) done(affiliateSaveErr);

						// Update Affiliate name
						affiliate.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Affiliate
						agent.put('/api/affiliates/' + affiliateSaveRes.body._id)
							.send(affiliate)
							.expect(200)
							.end(function(affiliateUpdateErr, affiliateUpdateRes) {
								// Handle Affiliate update error
								if (affiliateUpdateErr) done(affiliateUpdateErr);

								// Set assertions
								(affiliateUpdateRes.body._id).should.equal(affiliateSaveRes.body._id);
								(affiliateUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Affiliates if not signed in', function(done) {
		// Create new Affiliate model instance
		var affiliateObj = new Affiliate(affiliate);

		// Save the Affiliate
		affiliateObj.save(function() {
			// Request Affiliates
			request(app).get('/api/affiliates')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Affiliate if not signed in', function(done) {
		// Create new Affiliate model instance
		var affiliateObj = new Affiliate(affiliate);

		// Save the Affiliate
		affiliateObj.save(function() {
			request(app).get('/api/affiliates/' + affiliateObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', affiliate.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Affiliate instance if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Affiliate
				agent.post('/api/affiliates')
					.send(affiliate)
					.expect(200)
					.end(function(affiliateSaveErr, affiliateSaveRes) {
						// Handle Affiliate save error
						if (affiliateSaveErr) done(affiliateSaveErr);

						// Delete existing Affiliate
						agent.delete('/api/affiliates/' + affiliateSaveRes.body._id)
							.send(affiliate)
							.expect(200)
							.end(function(affiliateDeleteErr, affiliateDeleteRes) {
								// Handle Affiliate error error
								if (affiliateDeleteErr) done(affiliateDeleteErr);

								// Set assertions
								(affiliateDeleteRes.body._id).should.equal(affiliateSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Affiliate instance if not signed in', function(done) {
		// Set Affiliate user 
		affiliate.user = user;

		// Create new Affiliate model instance
		var affiliateObj = new Affiliate(affiliate);

		// Save the Affiliate
		affiliateObj.save(function() {
			// Try deleting Affiliate
			request(app).delete('/api/affiliates/' + affiliateObj._id)
			.expect(403)
			.end(function(affiliateDeleteErr, affiliateDeleteRes) {
				// Set message assertion
				(affiliateDeleteRes.body.message).should.match('User is not authorized');

				// Handle Affiliate error error
				done(affiliateDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec(function(){
			Affiliate.remove().exec(function(){
				done();
			});
		});
	});
});
