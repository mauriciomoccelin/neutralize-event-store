import db from '../../config/database/connection'
import dbdf from '../../config/database/definition'

const getRequestLogs = async ({ datetime, limit, offset }) => {
  return await db(dbdf.table.request.name)
    .column(dbdf.table.request.field)
    .where(dbdf.table.request.field.datetime, '>', datetime)
    .orderBy(dbdf.table.request.field.datetime, 'desc')
    .limit(limit || 1000).offset(offset || 0)
}

const getRequestLogById = async ({ id }) => {
  return await db(dbdf.table.request.name)
    .where({ [dbdf.table.request.field.id]: id })
    .column(dbdf.table.request.field)
    .first()
}

const newRequestLog = async ({ input }) => {
  await db(dbdf.table.request.name)
    .insert(
      dbdf.table.request.create(
        input.datetime,
        input.runtime,
        input.userId,
        input.dataSend,
        input.dataReceived
      )
    ).table(dbdf.table.request.name)
  return true
}

export {
  newRequestLog,
  getRequestLogs,
  getRequestLogById
}