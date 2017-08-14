define('profile', () => {
  anchored.on(App.DNA.Hash).as('registered_users') // automatically creates link from App.DNA.Hash to entry on commit
  validates.existenceOf('agent_id', {type: hash})
  validates.existenceOf('username', {type: string})
  validates.existenceOf('firstName', {type: string})
  validates.existenceOf('lastName', {type: string})
  validates.existenceOf('email', {type: string})
  validates.optionalExistenceOf('avatar', {type: url})
  validates.absenceOfOtherProperties()
  validates.sourcesWith( (sources, profile) => sources[0]==profile.agent_id, 'nobody can add/change somebody elses profile')
})
