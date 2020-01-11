const uuid = require('uuid/v1')
module.exports = {
  name: 'integrations',
  field: {
    id: 'id',
    datetime: 'datetime',
    runtime: 'runtime',
    userId: 'user_id',
    dataSend: 'data_send',
    dataReceived: 'data_received'
  },
  create(datetime, runtime, userId, dataSend, dataReceived) {
    return {
      id: uuid(),
      datetime: datetime || new Date().toISOString(),
      runtime: runtime || '00:00:00.0000',
      user_id: userId,
      data_send: dataSend,
      data_received: dataReceived
    }
  }
}