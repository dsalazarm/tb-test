const { expect } = require('chai')
const { APIError } = require('../helpers')
const {
  bodyParserHandler,
  fourOhFourHandler,
  fourOhFiveHandler,
  globalErrorHandler
} = require('./error')

describe('Error Handlers Tests', () => {
  describe('bodyParserHandler', () => {
    it('should return a "Bad Request" APIError for SyntaxError', () => {
      const error = new SyntaxError('Unexpected token')
      const req = {}
      const res = {}
      const next = (err) => {
        expect(err).to.be.an.instanceOf(APIError)
        expect(err.status).to.equal(400)
        expect(err.title).to.equal('Bad Request')
        expect(err.message).to.equal('Malformed JSON.')
      }

      bodyParserHandler(error, req, res, next)
    })

    it('should return a "Bad Request" APIError for TypeError', () => {
      const error = new TypeError('Cannot read property "name" of undefined')
      const req = {}
      const res = {}
      const next = (err) => {
        expect(err).to.be.an.instanceOf(APIError)
        expect(err.status).to.equal(400)
        expect(err.title).to.equal('Bad Request')
        expect(err.message).to.equal('Malformed JSON.')
      }

      bodyParserHandler(error, req, res, next)
    })
  })

  describe('fourOhFourHandler', () => {
    it('should return a "Resource Not Found" APIError', () => {
      const req = { path: '/unknown-path' }
      const res = {}
      const next = (err) => {
        expect(err).to.be.an.instanceOf(APIError)
        expect(err.status).to.equal(404)
        expect(err.title).to.equal('Resource Not Found')
        expect(err.message).to.equal('/unknown-path is not valid path to a Files Handler API resource.')
      }

      fourOhFourHandler(req, res, next)
    })
  })

  describe('fourOhFiveHandler', () => {
    it('should return a "Method Not Allowed" APIError', () => {
      const req = { method: 'PATCH', path: '/v1/files' }
      const res = {}
      const next = (err) => {
        expect(err).to.be.an.instanceOf(APIError)
        expect(err.status).to.equal(405)
        expect(err.title).to.equal('Method Not Allowed')
        expect(err.message).to.equal('PATCH method is not supported at /v1/files.')
      }

      fourOhFiveHandler(req, res, next)
    })
  })

  describe('globalErrorHandler', () => {
    it('should return an APIError when error is not an instance of APIError', () => {
      const error = new Error('Some error')
      const req = {}
      const res = {
        status: (status) => ({
          json: (err) => {
            expect(err).to.be.an.instanceOf(APIError)
            expect(err.status).to.equal(500)
            expect(err.title).to.equal('Internal Server Error')
            expect(err.message).to.equal('Some error')
          }
        })
      }
      const next = () => { }

      globalErrorHandler(error, req, res, next)
    })

    it('should return the given APIError when error is an instance of APIError', () => {
      const error = new APIError(400, 'Bad Request', 'Invalid parameter')
      const req = {}
      const res = {
        status: (status) => ({
          json: (err) => {
            expect(err).to.equal(error)
          }
        })
      }
      const next = () => { }

      globalErrorHandler(error, req, res, next)
    })
  })
})
