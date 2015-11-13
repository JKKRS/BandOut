var request = require('supertest')
var routes = require(__server + '/index.js')
var UsersAPI = require(__server + '/apis/users-api');

describe("The Server", function() {

  var app = TestHelper.createApp()
  app.use('/apis/users', UsersAPI)
  app.use('/', routes)
  app.testReady()

  it("serves an example endpoint", function() {

    // Mocha will wait for returned promises to complete
    return request(app)
      .get('/api/tags-example')
      .expect(200)
      .expect(function(response) {
        expect(response.body).to.include('node')
      })
  })

  it("posts to the /apis/users endpoint", function() {
    return request(app)
      .post('/apis/users')
      .expect(201)
      .expect(function(response) {
        console.log('response is', response.body)
      })
  })
})
