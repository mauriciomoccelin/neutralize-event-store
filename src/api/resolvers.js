import db from '../config/database'
import dbdf from '../config/database/databaseDefinitions'

export default {
  async getRequestsLog() {
    return await db(dbdf.table.requests.name)
      .column(dbdf.table.requests.field)
      .select()
  },
  async getRequestsLogById({ id }) {
    return await db(dbdf.table.requests.name)
      .where({ [dbdf.table.requests.field.id]: id })
      .column(dbdf.table.requests.field)
      .first()
  },
  async newRequestLog({ input }) {
    await db(dbdf.table.requests.name)
      .insert(
        dbdf.table.requests.create(
          input.datetime,
          input.runtime,
          input.userId,
          input.dataSend,
          input.dataReceived
        )
      ).table(dbdf.table.requests.name)
    return true
  }
}