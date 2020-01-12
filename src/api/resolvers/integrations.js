import db from '../../config/database/connection'
import dbdf from '../../config/database/definition'
import { getOffset } from '../../helpers/knex-query-helper'

const getIntegrationsLog = async ({ datetime, limit, offset, search }) => {
  return await db(dbdf.table.integration.name)
    .column(dbdf.table.integration.field)
    .where(dbdf.table.request.field.datetime, '>', datetime)
    .andWhere(builder => {
      if (search) {
        builder.orWhere(dbdf.table.integration.field.userId, 'like', `${search}%`)
      } else builder.where(1, 1)
    })
    .orderBy(dbdf.table.integration.field.datetime, 'desc')
    .limit(limit).offset(getOffset(limit, offset))
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