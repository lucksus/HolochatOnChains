# Holochat on Chains
This is an example Holochain app project showing how I would like to write Holochain apps. (see https://github.com/metacurrency/holochain)

This is WIP and based off of https://github.com/holochain/holochat. The plan is to port everything over from Holochat and then change Holochain so this app can be run by it.

I chose ECMAScript 6 as the language for all config and application files. Even for the DNA itself. Everything is runnable code and much better to read than JSON files. Ultimately I'd like to do this in Ruby but we already have a JS ribosome and that should get updated to ES6 anyway ;P

## Entry Type Definitions
Main difference is that entry types are being defined by
runnable code (here, all ES6) and incorporate their validation rules - as well as definitions for their
associations with other entry types which are automatically
translated into link types.

```javascript
define('message', () => {
  belongsTo('room') // adds link type entries and accessor functions
  validates.existenceOf('content', {type: string})
  validates.existenceOf('timestamp', {type: string})
  validates.existenceOf('room', {type: association})
  validates.optionalExistenceOf('inReplyTo', {type: string})
  validates.absenceOfOtherProperties()
  validates.sourcesWith( (sources) => isRegistered(sources[0]), 'message from unregistered source')
})
```
With this we don't need a separate
schema file but could still have one with

```javascript
validates.jsonSchema('message.json')
```

## Zomes
Entry types are not *part* of a Zome
but instead Zomes define a list of required types
(so when referencing a Zome via a mix-in for instance
we know which entry type definitions to include)

```javascript
Zome.name = 'message'
Zome.requireEntryTypes = ['message', 'room']
Zome.requireZome = ['hashtag']

Zome.genesis = () => {
  debug("HoloChat App Starting...")
  return true
}
```
Meta information about a Zome's function should be next
to that function:

```javascript
Zome.addFunction({
  name: 'listMessages',
  callingType: 'json',
  exposure: 'public',
  fn: (room) => {
    var messages = room.getMessages() // automatically added accessor
    var return_messages = new Array(messages.length);
    for( i=0; i<messages.length; i++) {
      return_messages[i] = JSON.parse(messages[i]["E"])
      return_messages[i].id = messages[i]["H"]
      var author_hash = get(messages[i]["H"],{GetMask:HC.GetMask.Sources})[0]
      var agent_profile_link = getLink(author_hash, "profile", {Load: true})
      return_messages[i].author = JSON.parse(agent_profile_link.Links[0].E)
    }
    return return_messages
  }
})
```

## DNA
With all that info concisely packed into the entries and zomes themselves, the DNA manifest file can be much shorter:

```javascript
App.UUID = "00000000-0000-0000-0000-000000000000"
App.version = 0
App.name = "chat"
App.properties = {
    name: "My Chat",
    purpose: "chatting up a storm",
    language: "en",
    initial_admin: "chuck@norris.com"
  }
App.propertiesSchemaFile = "properties_schema.json"

Dht.hashType = 'sha2-256'

App.zomesDirectory = 'zomes' // default, could be ommited
                             // reads all files in this directory
App.entryTypesDirectory = 'entry_types' // same here

useMixIn({
  name: 'anchor',
  repo: 'https://github.com/Holochain/mixins',
  commit: 'd46a31f',
  hash: 'QmenQcCv4919qYEWtktugfzNqwb1FnUYjEuRHdacggpWyL',
  path: 'anchor'
})
```
