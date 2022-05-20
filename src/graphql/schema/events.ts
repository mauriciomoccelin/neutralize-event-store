const fields = `
  type: String!,
  dateTime: String!,
  aggregateId: String!,
  data: String,
  metadata: String
`;

const type = `
  type Event {
    ${fields}
  }

  type EventPagination {
    total: Int!,
    items: [Event!]
  }
`;

const input = `
  input EventInput {
    ${fields}
  }
`;

const queries = `
  getEventById(id: String!): Event
  getEvents(datetime: String!, limit: Int, offset: Int, type: String): EventPagination!
`;

const mutations = `
  newEvent(input: EventInput!): Boolean
`;

export default {
  type,
  input,
  queries,
  mutations,
};
