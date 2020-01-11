const uuid = require('uuid/v1')
module.exports = {
  name: 'request',
  field: {
    id: 'id',
    runtime: 'runtime',
    datetime: 'datetime',
    userAgent: 'user_agent',
    request: 'request_data',
    response: 'response_data',
    identifier: 'identifier'
  },
  create(runtime, datetime, userAgent, request, response, identifier) {
    return {
      id: uuid(),
      datetime: datetime,
      runtime: runtime,
      user_agent: userAgent,
      request_data: request,
      response_data: response,
      identifier: identifier
    }
  }
}