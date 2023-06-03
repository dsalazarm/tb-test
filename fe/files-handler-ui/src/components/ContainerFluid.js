import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import React from 'react'
import TableWrapper from './TableWrapper'
import { useGetFileLinesQuery } from '../services/file-lines.service'

const ContainerFluid = ({ fileName }) => {
  const headers = [
    {
      title: 'File Name',
      styleObject: {
        minWidth: '3em'
      }
    },
    {
      title: 'Text',
      styleObject: {
        minWidth: '3em'
      }
    },
    {
      title: 'Number',
      styleObject: {
        minWidth: '3em'
      }
    },
    {
      title: 'Hex',
      styleObject: {
        minWidth: '3em'
      }
    }
  ]

  const { data, error, isLoading } = useGetFileLinesQuery(fileName)

  return (
    <Container fluid>
      <Row style={{ border: '1px solid black', height: '35px' }}>
        <Col style={{ textAlign: 'left', backgroundColor: '#FF6666', fontWeight: 'bold', color: 'white', alignItems: 'center', display: 'flex' }}>React Test App</Col>
      </Row>
      <Row style={{ margin: '15px 15px 0px 15px' }}>
        {error
          ? (
            <>Oh no, there was an error</>
          )
          : isLoading
            ? (
              <>Loading...</>
            )
            : data
              ? (
                <>
                  <TableWrapper headers={headers} records={data} />
                </>
              )
              : null}
      </Row>
    </Container>

  )
}

export default ContainerFluid
