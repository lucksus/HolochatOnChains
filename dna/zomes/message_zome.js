Zome.name = 'message'
Zome.requireEntryTypes = ['message', 'room']
Zome.requireZome = ['hashtag']

Zome.genesis = () => {
  debug("HoloChat App Starting...")
  return true
}


Zome.addFunction({
  name: 'listMessages',
  callingType: 'json',
  exposure: 'public',
  fn: (room) => {
    var messages = getLink(room, "message",{Load:true});
    if( messages instanceof Error ) {
      return []
    } else {
      messages = messages.Links
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
  }
})

Zome.addFunction({
  name: 'newMessage',
  callingType: 'json',
  exposure: 'public',
  fn: (x) => {
    x.timestamp = new Date();
    var key = commit("message", x);
    commit("room_message_link",{Links:[{Base:x.room,Link:key,Tag:"message"}]})
    debug(x.content);
    debug("Starting HASHtag search");
    call("hashtag","callingHashTag",x);
  }
})
