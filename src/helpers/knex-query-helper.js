export const getOffset = (limit, offset) =>  limit * (offset - 1)
export const saveLog = async (table, input) => await db(table).insert(input)