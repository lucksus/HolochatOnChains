import * as hc from holochain/entry_property_types.js

export let transaction = HoloEntry('transaction', ()=>{
  hasOne(hc.agent_entry, 'from')
  hasOne(hc.agent_entry, 'to')
  prop('amount', hc.number, hc.required)

  //Holochain knows entry type traits.
  //This defines a special class of 'transactions' that we call 'notarized'
  //Trait definitions are identical to definitions of validations.
  //The difference is that not all entries need to pass every trait definition.
  //Instead, trait definitions are used to extract code that checks a specific
  //characteristic of an entry that can be part of a validation
  //or used to select entries of a certain type.
  trait('notarized', {
    //Trait definitions consist of a validation function and the following
    //definition of pre-fetched/pre-calculated variables.
    //This is an abstract and powerful way to do what we before did
    //with validation packages.
    //These functions are being called to create a 'validation package' definition
    //i.e. information about what to fetch from other nodes (the transactions source
    //in this case).
    //After these requests finish successfully, the results are made available
    //under the properties names within the script context in which the
    //validation function is then executed
    nonlocals: {
      source_transactions: () => transaction.source().chainEntries('transaction'),
      source_notarizations: () => transaction.source().chainEntries('notarization')
    },

    //this function checks for a given transaction if it adheres to the trait 'notarized'
    validation: (transaction)=>{
      //which it only does if it:
      //1. is included in the source chain of the transaction's source
      let t = source_transactions.find((t)=>{
        t.hash === transaction.hash
      })
      if( t !== transaction) return false

      //2. the source chain also holds a notarization for that transaction
      let notarization = source_notarizations.find((n)=>{
        n.transaction === transaction
      })
      if( notarization === null ) return false

      //3. and that notarization is not signed by the sender of the transaction
      if( notarization.isSelfSigned() ) return false
      //.isSelfSigned() is available (added by the ribosome) because notarization
      //defines a trait with the name 'selfSigned'
      //(see notarization.js)

      //4. and the notarization has sufficient number of validations
      return notarization.number_validations > 40
    }
  })

  //It is possible attach properties to agents when introducing new entry types.
  //This results in all (ES) objects that represent an agent to be populated
  //with these custom functions.
  //Properties are not stored anywhere, but instead calculated when needed.
  //This example calculates the account balance of an agent before (=up until)
  //a given transaction.
  agentProperty('accountBalanceBefore', {
    //This is the parameter with which accountBalanceBefore() can be called:
    //```accountBalanceBefore('Qm3d73hsr8w...')```
    //(it is used in the nonlocals section below)
    parameters: ['transactionHash'],
    //Same as with the traits: stuff that needs to be fetched from other nodes first
    nonlocals: {
      //Here we are making use of the trait defined above.
      notarizedTransactions: agent.chainEntriesBefore(
        //chainEntriesBefore([entry_type1, entry_type2, ...], hashOfFirstEntryNotToInclude)
        ['transaction:notarized'],
        transactionHash
      )
    },

    //This is the function that calculcates (=infers) the actual property value
    infer: (agent)=>{
      let accountBalance = 0
      notarizedTransactions.forEach((entry)=>{
        if(entry.to == source()) {
          //receiving transaction
          accountBalance += entry.amount
        }
        if(entry.from == source()) {
          //sending transaction
          accountBalance -= entry.amount
        }
      })
      return accountBalance
    }
  })

  validates('source account balance', {
    nonlocals: {
      sourceBalanceBefore: source().accountBalanceBefore(entry().hash())
    },

    validation: (transaction) => sourceBalanceBefore >= transaction.amount
  })

  validates('source equals from', {
    validation: (transaction) => transaction.source() == transaction.from
  })
})
