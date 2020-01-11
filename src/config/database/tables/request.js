const uuid = require('uuid/v1')
module.exports = {
  name: 'requests',
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
      datetime: datetime || new Date().toISOString(),
      runtime: runtime || '00:00:00.0000',
      user_agent: userAgent || 'NOT SPECIFIED',
      request_data: request ? JSON.stringify(request) : null,
      response_data: response ? JSON.stringify(response) : null,
      identifier: identifier
    }
  }
}