const dayjs = require("dayjs")
const { OrderSequence } = require("../models")

module.exports = async (transaction) => {
  const today = dayjs().format("YYYYMMDD")

  // lock row to prevent race condition
  let sequence = await OrderSequence.findOne({
    where: { date: today },
    transaction,
    lock: transaction.LOCK.UPDATE
  })

  if (!sequence) {
    sequence = await OrderSequence.create({
      date: today,
      last_number: 1
    }, { transaction })
  } else {
    sequence.last_number += 1
    await sequence.save({ transaction })
  }

  const padded = String(sequence.last_number).padStart(4, "0")
  const prefix = 'ORD-AVLJBG'

  return `${prefix}-${today}-${padded}`
}