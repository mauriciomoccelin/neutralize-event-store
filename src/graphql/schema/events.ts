const fields = `
  datetime: String!,
  payload: String
`

const type = `
  type Event {
    id: String!,
    ${fields}
  }

  type EventPagination {
    total: Int!,
    itens: [Event!]!
  }
`

const input = `
  input EventInput {
    ${fields}
  }
`

const queries = `
  getEventById(id: String!): Event
  getEvents(datetime: String!, limit: Int, offset: Int, search: String): EventPagination
`

const mutations = `
  newEvent(input: EventInput!): Boolean
`

export default {
  type,
  input,
  queries,
  mutations
}
