const fields = `
  datetime: String!,
  runtime: String!,
  userAgent: String,
  requet: String,
  response: String,
  identifier: String
`

const type = `
  type RequestLog {
    id: String!,
    ${fields}
  }

  type RequestLogPagination {
    total: Int!,
    itens: [RequestLog!]!
  }
`

const input = `
  input RequestLogInput {
    ${fields}
  }
`

const querys = `
    getRequestLogs(datetime: String!, limit: Int, offset: Int, search: String): RequestLogPagination
    getRequestLogById(id: String!): RequestLog
`

const mutations = `
    newRequestLog(input: RequestLogInput!): Boolean
`

export default {
  type,
  input,
  querys,
  mutations
}