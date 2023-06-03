// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const fileLinesService = createApi({
  reducerPath: 'fileLinesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/v1/' }),
  endpoints: (builder) => ({
    getFileLines: builder.query({
      query: (fileName) => `files/data?fileName=${fileName}`,
      transformResponse: (response, meta, arg) => {
        const result = []
        response.forEach(fileInfo => {
          fileInfo.lines.forEach(line => {
            result.push({
              fileName: fileInfo.file,
              text: line.text,
              number: line.number,
              hex: line.hex
            })
          })
        })

        return result
      }
    })
  })
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetFileLinesQuery } = fileLinesService
