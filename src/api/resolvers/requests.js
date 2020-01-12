import db from '../../config/database/connection'
import dbdf from '../../config/database/definition'
import { getOffset } from '../../helpers/knex-query-helper'

const getRequestLogs = async ({ datetime, limit, offset, search }) => {
  let totalResult = await db(dbdf.table.request.name)
    .count(dbdf.table.request.field.id, { as: 'total' })
    .where(dbdf.table.request.field.datetime, '>', datetime)
    .andWhere(builder => {
        if (search) {
          builder.where(dbdf.table.request.field.identifier, 'like', `${search}%`)
          builder.orWhere(dbdf.table.request.field.userAgent, 'like', `${search}%`)
        } else builder.where(1, 1)
    })

  let itensResult = await db(dbdf.table.request.name)
    .column(dbdf.table.request.field)
    .where(dbdf.table.request.field.datetime, '>', datetime)
    .andWhere(builder => {
        if (search) {
          builder.where(dbdf.table.request.field.identifier, 'like', `${search}%`)
          builder.orWhere(dbdf.table.request.field.userAgent, 'like', `${search}%`)
        } else builder.where(1, 1)
    })
    .orderBy(dbdf.table.request.field.datetime, 'desc')
    .limit(limit).offset(getOffset(limit, offset))

    return {
      total: totalResult[0]['total'] || 0,
      itens: itensResult
    }
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