const { APIError } = require('../helpers')
const { tbxNetApi } = require('../integrations')

function createLineElement(headerNames, rowValues) {
  const result = {}

  headerNames.forEach((header, index) => {
    if (header === 'number') {
      result[ header ] = parseInt(rowValues[ index ])
    } else {
      result[ header ] = rowValues[ index ]
    }
  })

  return result
}

function getHeadersAndDataFromRawCsv(csvText) {
  const csvRows = csvText.split('\n')

  return {
    headersRow: csvRows[ 0 ],
    dataRows: csvRows.slice(1, csvRows.length)
  }
};

function createFileElement(dataRows, defaultHeaders) {
  const fileElement = {
    file: '',
    lines: []
  }

  dataRows.forEach(row => {
    const rowValues = row.split(',')
    const hasEqualLength = rowValues.length === defaultHeaders.length

    if (hasEqualLength) {
      if (fileElement.file === '') {
        fileElement.file = rowValues[ 0 ]
      }

      const [ , ...headersWithoutFileName ] = defaultHeaders
      const [ , ...valuesWithoutFileName ] = rowValues

      if (valuesWithoutFileName.every(value => value !== '')) {
        fileElement.lines.push(createLineElement(headersWithoutFileName, valuesWithoutFileName))
      }
    }
  })

  return fileElement
}

async function processFileName(fileName) {
  let defaultHeaders = []
  const fileApiResult = await tbxNetApi.getFileByName(fileName)

  if (fileApiResult instanceof APIError) {
    console.log('Error: ', fileApiResult)
    return null
  }

  if (fileApiResult && typeof fileApiResult === 'string') {
    const { headersRow, dataRows } = getHeadersAndDataFromRawCsv(fileApiResult)

    if (!headersRow) {
      console.error('Error: Empty headersRow')
      return null
    }

    defaultHeaders = headersRow.split(',')

    console.log(dataRows)

    if (dataRows && dataRows.length > 0) {
      return createFileElement(dataRows, defaultHeaders)
    }
  }

  return null
}

/**
 * List all the things. Query params ?skip=0&limit=1000 by default
 */
async function readFiles(request, response, next) {
  const fileNameFilter = request.query.fileName || ''

  if (fileNameFilter !== '') {
    const result = await processFileName(fileNameFilter)
    return result ? response.json([ result ]) : response.status(404).json([])
  } else {
    try {
      const fileNamesResult = await tbxNetApi.getFiles()

      if (fileNamesResult instanceof APIError) {
        console.log('Error: ', fileResult)
        return next(fileNamesResult)
      }
      const fileNames = fileNamesResult.files || []

      if (Array.isArray(fileNames) && fileNames.length > 0) {
        const promises = fileNames.map(fileName => processFileName(fileName))
        const results = await Promise.all(promises)
        const filteredResults = results.filter(result => result && result.lines.length > 0)

        return response.json(filteredResults)
      }
    } catch (err) {
      console.log(err)
      return next(err)
    }
  }
}

async function readRawFiles(request, response, next) {
  try {
    return response.json(await tbxNetApi.getFiles())
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  // private methods
  createLineElement,
  getHeadersAndDataFromRawCsv,
  createFileElement,
  processFileName,
  // public methods
  readFiles,
  readRawFiles
}
