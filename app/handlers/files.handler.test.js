const { expect } = require('chai');
const sinon = require('sinon');
const { APIError } = require('../helpers');
const { tbxNetApi } = require('../integrations');
const {
  createLineElement,
  getHeadersAndDataFromRawCsv,
  createFileElement,
  processFileName,
  readFiles,
  readRawFiles
} = require('./files.handler');

describe('createLineElement', () => {
  it('should create a line element with correct values', () => {
    const headerNames = [ 'name', 'age', 'number' ];
    const rowValues = [ 'John', '30', '123' ];

    const result = createLineElement(headerNames, rowValues);

    expect(result).to.deep.equal({
      name: 'John',
      age: '30',
      number: 123
    });
  });
});

describe('getHeadersAndDataFromRawCsv', () => {
  it('should extract headers row and data rows from raw CSV text', () => {
    const csvText = 'name,age\nJohn,30\nJane,25';

    const result = getHeadersAndDataFromRawCsv(csvText);

    expect(result.headersRow).to.equal('name,age');
    expect(result.dataRows).to.deep.equal([ 'John,30', 'Jane,25' ]);
  });
});

describe('createFileElement', () => {
  it('should create a file element with correct lines', () => {
    const dataRows = [ 'file1,header1,value1', ',header2,value2', 'file1,header3,value3' ];
    const defaultHeaders = [ 'file', 'header1', 'header2' ];

    const result = createFileElement(dataRows, defaultHeaders);

    expect(result).to.deep.equal({
      file: 'file1',
      lines: [
        { header1: 'header1', header2: 'value1' },
        { header1: 'header2', header2: 'value2' },
        { header1: 'header3', header2: 'value3' }
      ]
    });
  });
});

describe('processFileName', () => {
  let tbxNetApiStub;

  beforeEach(() => {
    tbxNetApiStub = sinon.stub(tbxNetApi, 'getFileByName');
  });

  afterEach(() => {
    tbxNetApiStub.restore();
  });

  it('should return null when file API result is null', async () => {
    const fileName = 'file1';
    tbxNetApiStub.withArgs(fileName).returns(null);

    const result = await processFileName(fileName);

    expect(result).to.be.null;
  });

  it('should return null when headersRow is empty', async () => {
    const fileName = 'file1';
    const fileApiResult = 'Invalid CSV data';
    tbxNetApiStub.withArgs(fileName).returns(fileApiResult);

    const result = await processFileName(fileName);

    expect(result).to.be.null;
  });

  it('should return null when dataRows is empty', async () => {
    const fileName = 'file1';
    const fileApiResult = 'name,age';
    tbxNetApiStub.withArgs(fileName).returns(fileApiResult);

    const result = await processFileName(fileName);

    expect(result).to.be.null;
  });

  it('should return default when dataRows are present but no lines are created', async () => {
    const fileName = 'file1';
    const fileApiResult = 'file1,,\n';
    tbxNetApiStub.withArgs(fileName).returns(fileApiResult);

    const result = await processFileName(fileName);

    expect(result).to.deep.equal(
      { file: '', lines: [] }
    );
  });
});

describe('readFiles', () => {
  let tbxNetApiStub;

  beforeEach(() => {
    tbxNetApiStub = sinon.stub(tbxNetApi, 'getFiles');
  });

  afterEach(() => {
    tbxNetApiStub.restore();
  });

  it('should return an empty object when fileName filter is provided but result is null', async () => {
    const request = {
      query: {
        fileName: 'file1'
      }
    };
    const response = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };
    const processFileNameStub = sinon.stub().returns(null);

    const next = sinon.spy();

    await readFiles(request, response, next);

    expect(response.json.calledWith([])).to.be.true;
    expect(response.status.calledWith(404)).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  // Add more tests as needed
});

describe('readRawFiles', () => {
  let tbxNetApiStub;

  beforeEach(() => {
    tbxNetApiStub = sinon.stub(tbxNetApi, 'getFiles');
  });

  afterEach(() => {
    tbxNetApiStub.restore();
  });

  it('should return files from tbxNetApi as JSON response', async () => {
    const files = [ 'file1', 'file2' ];
    tbxNetApiStub.resolves({ files });

    const response = {
      json: sinon.spy()
    };
    const next = sinon.spy();

    await readRawFiles({}, response, next);

    expect(response.json.calledWith({ files })).to.be.true;
    expect(next.notCalled).to.be.true;
  });
});
