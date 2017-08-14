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
