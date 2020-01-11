import db from '../../config/database/connection'
import dbdf from '../../config/database/definition'

const getIntegrationsLog = async ({ datetime, limit, offset }) => {
  return await db(dbdf.table.integration.name)
    .column(dbdf.table.integration.field)
    .where(dbdf.table.request.field.datetime, '>', datetime)
    .orderBy(dbdf.table.request.field.datetime, 'desc')
    .limit(limit || 1000).offset(offset || 0)
}

const getIntegrationLogById = async ({ id }) => {
  return await db(dbdf.table.integration.name)
    .where({ [dbdf.table.integration.field.id]: id })
    .column(dbdf.table.integration.field)
    .first()
}

const newIntegrationLog = async ({ input }) => {
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

export {
  newIntegrationLog,
  getIntegrationsLog,
  getIntegrationLogById
}