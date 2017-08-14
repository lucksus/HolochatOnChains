export function isAllowed(author) {
    debug("Checking if "+author+" is a registered user...")
    var registered_users = getLink(App.DNA.Hash, "registered_users",{Load:true});
    debug("Registered users are: "+JSON.stringify(registered_users));
    if( registered_users instanceof Error ) return false;
    registered_users = registered_users.Links
    for(var i=0; i < registered_users.length; i++) {
        var profile = JSON.parse(registered_users[i]["E"])
        debug("Registered user "+i+" is " + profile.username)
        if( profile.agent_id == author) return true;
    }
    return false;
}

export function isValidRoom(room) {
    debug("Checking if "+room+" is a valid...")
    var rooms = getLink(App.DNA.Hash, "room",{Load:true});
    debug("Rooms: " + JSON.stringify(rooms))
  if( rooms instanceof Error ){
      return false
  } else {
    rooms = rooms.Links
    for( i=0; i<rooms.length; i++) {
      if( rooms[i]["H"] == room) return true
    }
    return false
  }
}
