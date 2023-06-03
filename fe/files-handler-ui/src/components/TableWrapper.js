import Table from 'react-bootstrap/Table'

const TableWrapper = ({ headers, records }) => {
  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr style={{ borderBottom: '2px solid black' }}>
            {headers.map((header, index) => <th key={index} style={header.styleObject}>{header.title}</th>)}
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => {
            return (
              <tr key={index}>
                {Object.keys(record).map((key, index2) =>
                  <td key={index2}>{record[key]}</td>
                )}
              </tr>
            )
          })}
        </tbody>
      </Table>
    </>
  )
}

export default TableWrapper
