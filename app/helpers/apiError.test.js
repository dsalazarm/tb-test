const { expect } = require('chai');
const APIError = require('./apiError');

describe('APIError', () => {
  it('should create an instance of APIError with default values', () => {
    const error = new APIError();

    expect(error).to.be.an.instanceOf(APIError);
    expect(error.status).to.equal(500);
    expect(error.title).to.equal('Internal Server Error');
    expect(error.message).to.equal('An unknown server error occurred.');
  });

  it('should create an instance of APIError with the provided values', () => {
    const error = new APIError(404, 'Not Found', 'Resource not found');

    expect(error).to.be.an.instanceOf(APIError);
    expect(error.status).to.equal(404);
    expect(error.title).to.equal('Not Found');
    expect(error.message).to.equal('Resource not found');
  });

  it('should serialize the APIError instance to JSON', () => {
    const error = new APIError(400, 'Bad Request', 'Invalid input');
    const serializedError = error.toJSON();

    expect(serializedError).to.deep.equal({
      error: {
        status: 400,
        title: 'Bad Request',
        message: 'Invalid input'
      }
    });
  });
});
