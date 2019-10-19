import { buildSchema } from 'graphql'

const requestLogFields = `
  datetime: String!,
  runtime: String!,
  userId: String!,
  dataSend: String,
  dataReceived: String
`
const types = `
  type RequestLog {
    id: String!,
    ${requestLogFields}
  }
`
const inputs = `
  input RequestLogInput {
    ${requestLogFields}
  }
`
const querys = `
  type Query {
    getRequestsLog: [RequestLog!]!
    getRequestsLogById(id: String!): RequestLog
  }
`
const mutations = `
  type Mutation {
    newRequestLog(input: RequestLogInput!): Boolean
  }
`
export default buildSchema(`
  ${types}
  ${inputs}
  ${querys}
  ${mutations}
`)