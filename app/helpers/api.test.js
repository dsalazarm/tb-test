const { expect } = require('chai')
const createAxiosInstance = require('./api')

describe('createAxiosInstance', () => {
  it('should create an instance of Axios with the provided config', () => {
    const config = {
      url: 'https://api.example.com',
      apiVersion: 'v1',
      defaultAuthType: 'Bearer',
      defaultAuthToken: 'your-auth-token',
      defaultTimeout: 5000
    }

    const axiosInstance = createAxiosInstance(config)

    expect(axiosInstance.defaults.baseURL).to.equal('https://api.example.com/v1/')
    expect(axiosInstance.defaults.timeout).to.equal(5000)
    expect(axiosInstance.defaults.headers.common.Authorization).to.equal('Bearer your-auth-token')
  })

  it('should create an instance of Axios without authentication headers if defaultAuthType and defaultAuthToken are not provided', () => {
    const config = {
      url: 'https://api.example.com',
      apiVersion: 'v1',
      defaultTimeout: 5000
    }

    const axiosInstance = createAxiosInstance(config)

    expect(axiosInstance.defaults.baseURL).to.equal('https://api.example.com/v1/')
    expect(axiosInstance.defaults.timeout).to.equal(5000)
    expect(axiosInstance.defaults.headers.common.Authorization).to.be.undefined
  })

  it('should create an instance of Axios without an API version if apiVersion is not provided', () => {
    const config = {
      url: 'https://api.example.com',
      defaultAuthType: 'Bearer',
      defaultAuthToken: 'your-auth-token',
      defaultTimeout: 5000
    }

    const axiosInstance = createAxiosInstance(config)

    expect(axiosInstance.defaults.baseURL).to.equal('https://api.example.com/')
    expect(axiosInstance.defaults.timeout).to.equal(5000)
    expect(axiosInstance.defaults.headers.common.Authorization).to.equal('Bearer your-auth-token')
  })

  it('should create an instance of Axios with a default timeout of 10000 if defaultTimeout is not provided', () => {
    const config = {
      url: 'https://api.example.com',
      apiVersion: 'v1',
      defaultAuthType: 'Bearer',
      defaultAuthToken: 'your-auth-token'
    }

    const axiosInstance = createAxiosInstance(config)

    expect(axiosInstance.defaults.baseURL).to.equal('https://api.example.com/v1/')
    expect(axiosInstance.defaults.timeout).to.equal(10000)
    expect(axiosInstance.defaults.headers.common.Authorization).to.equal('Bearer your-auth-token')
  })
})
