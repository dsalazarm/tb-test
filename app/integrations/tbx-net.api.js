const { INTEGRATIONS } = require('../config')
const { api, APIError } = require('../helpers')

const apiInstance = api(INTEGRATIONS.tbxNet)

async function getFiles () {
  const route = 'secret/files'
  let response = {}

  try {
    response = await apiInstance.get(route)
    return response.data
  } catch (exception) {
    return new APIError(
      response.status,
      response.statusText,
      'Error getting file names'
    )
  }
}

async function getFileByName (fileName) {
  const route = `secret/file/${fileName}`
  let response = {}

  try {
    response = await apiInstance.get(route)
    return response.data
  } catch (exception) {
    return new APIError(
      response.status,
      response.statusText,
      `Error getting the file: ${fileName}, please try again later`
    )
  }
}

module.exports = {
  getFiles,
  getFileByName
}
