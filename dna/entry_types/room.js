import { isRegistered } from customValidations.js

define('room', () => {
  hasMany('messages') // adds link type room_message_link with validations that check types of linked entries
  validates.existenceOf('name', {type: string})
  validates.existenceOf('purpose', {type: string})
  validates.absenceOfOtherProperties()
  validates.sourcesWith( (sources) => isRegistered(sources[0]), 'only registered users can create rooms')
  validates.onDel( (room) => {
    return room.messages().length == 0
  }, "can't delete non-empty room")

  isImmutable() // makes all change validations fail
}
