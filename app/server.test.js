const chai = require('chai')
const chaiHttp = require('chai-http')
const { APP_NAME, PORT } = require('./config')
const app = require('./app')
const expect = chai.expect

chai.use(chaiHttp)

describe('Server', () => {
  let server

  before((done) => {
    server = app.listen(PORT, () => {
      console.log(`${APP_NAME} is listening on port ${PORT}...`)
      done()
    })
  })

  after(() => {
    server.close()
  })

  it('should return a "Method Not Allowed" response for an invalid HTTP method', async () => {
    chai
      .request(app)
      .patch('/v1/files')
      .end((err, res) => {
        expect(res.statusCode).to.equal(405)
        expect(res.body).to.be.an('object')
        expect(res.body.error.title).to.equal('Method Not Allowed')
      })
  })

  it('should return a "Not Found" response for an unknown route', async () => {
    chai
      .request(app)
      .get('/unknown-route')
      .end((err, res) => {
        expect(res.statusCode).to.equal(404)
        expect(res.body).to.be.an('object')
        expect(res.body.error.title).to.equal('Resource Not Found')
      })
  })

  describe('GET /v1/files', () => {
    it('should call to /data and return the formatted data', (done) => {
      chai
        .request(app)
        .get('/v1/files/data')
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(JSON.parse(res.text)).to.be.an('array')
          done()
        })
    })

    it('should call to /list and return the raw data from 3rd party server', (done) => {
      chai
        .request(app)
        .get('/v1/files/list')
        .end((err, res) => {
          expect(res).to.have.status(200)
          expect(JSON.parse(res.text)).to.be.an('object')
          done()
        })
    })
  })
})
