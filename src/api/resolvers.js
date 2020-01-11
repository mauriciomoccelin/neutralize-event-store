import db from '../config/database/connection'
import dbdf from '../config/database/definition'

export default {
  async getIntegrationLog() {
    return await db(dbdf.table.integration.name)
      .column(dbdf.table.integration.field)
      .select()
  },
  async getIntegrationLogById({ id }) {
    return await db(dbdf.table.integration.name)
      .where({ [dbdf.table.integration.field.id]: id })
      .column(dbdf.table.integration.field)
      .first()
  },
  async newIntegrationLog({ input }) {
    await db(dbdf.table.integration.name)
      .insert(
        dbdf.table.integration.create(
          input.datetime,
          input.runtime,
          input.userId,
          input.dataSend,
          input.dataReceived
        )
      ).table(dbdf.table.integration.name)
    return true
  }
}