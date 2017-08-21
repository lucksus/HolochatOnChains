import { transaction } from transaction.js
import * as hc from holochain/entry_property_types.js

export var notarization = HoloEntry('notarization', () => {
  hasOne(transaction)
  prop('number_validations', hc.number, hc.required)
  prop('notarized_at', hc.timestamp, hc.required)

  trait('selfSigned', (noterization) => notarization.source() === notarization.transaction.from() )

  validates('transaction', () => transaction.isValid())
  validates('number of validations', () => number_validations >= sources().length )
  validates('notarized in past', () => notarized_at < Time.now )
})
