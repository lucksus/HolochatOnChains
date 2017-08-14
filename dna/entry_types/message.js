import { isRegistered } from customValidations.js

define('message', () => {
  belongsTo('room') // checks existence of room object with
  validates.existenceOf('content', {type: string})
  validates.existenceOf('timestamp', {type: string})
  validates.existenceOf('room', {type: association})
  validates.optionalExistenceOf('inReplyTo', {type: string})
  validates.absenceOfOtherProperties()
  validates.sourcesWith( (sources) => isRegistered(sources[0]), 'message from unregistered source')
})
