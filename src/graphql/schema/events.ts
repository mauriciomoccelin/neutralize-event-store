const fields = `
  eventId: String!,
  datetime: String!,
  eventType: String,
  data: String,
  metadata: String
`

const type = `
  type Event {
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
