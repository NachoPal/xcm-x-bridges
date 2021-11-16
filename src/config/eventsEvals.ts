import { OK, FAIL } from './constants'

export const sudo = {
  Sudid: class Event {
    name = 'sudo.Sudid'
    lookupName = 'Result<Null, SpRuntimeDispatchError>'
    lookupIndex = 56

    constructor(){}

    check(data, callback = ()=>{}) {
      let reason = data.toString()
      let result = data.isOk ? OK : FAIL

      if (result === FAIL) {
        callback = () => { process.exit(0) }
      }

      process.stdout.write(`${result}-${this.name}-${reason}\n`, () => {
        callback(); 
      })
    }
  }
}

export const xcmPallet = {
  Attempted: class Event {
    name = 'xcmPallet.Attempted'
    lookupName = 'XcmV2TraitsOutcome'
    lookupIndex = -1

    constructor(){}

    check(data, callback = ()=>{}) {
      let reason = data.toString()
      let result = data.isComplete ? OK : FAIL

      process.stdout.write(`${result}-${this.name}-${reason}\n`, () => {
        callback(); 
      })
    }
  },
  Sent: class Event {
    name = 'xcmPallet.Sent'
    lookupName = 'XcmV2Xcm'
    lookupIndex = -1

    constructor(){}

    check(data, callback = ()=>{}) {
      let reason = data.toString()
      // let result = data.isComplete ? OK : FAIL

      process.stdout.write(`${OK}-${this.name}-${reason}\n`, () => {
        callback(); 
      })
    }
  },
}

export const polkadotXcm = {
  Attempted: class Event {
    name = 'polkadotXcm.Attempted'
    lookupName = 'XcmV2TraitsOutcome'
    lookupIndex = -1

    constructor(){}

    check(data, callback = ()=>{}) {
      let reason = data.toString()
      let result = data.isComplete ? OK : FAIL

      process.stdout.write(`${result}-${this.name}-${reason}\n`, () => {
        callback(); 
      })
    }
  },
  Sent: class Event {
    name = 'polkadotXcm.Sent'
    lookupName = 'XcmV2TraitsOutcome'
    lookupIndex = -1

    constructor(){}

    check(data, callback = ()=>{}) {
      let reason = data.toString()
      let result = data.isComplete ? OK : FAIL

      process.stdout.write(`${result}-${this.name}-${reason}\n`, () => {
        callback(); 
      })
    }
  },
}

export const dmpQueue = {
  ExecuteDownward: class Event {
    name = 'dmpQueue.ExecutedDownward'
    lookupName = 'XcmV2TraitsOutcome'
    lookupIndex = -1
    
    constructor(){}

    check(data, callback = ()=>{}) {
      let reason = data.toString()
      let result = data.isComplete ? OK : FAIL

      callback()
      return `${result}-${this.name}-${reason}`
    }
  }
}

export const ump = {
  ExecutedUpward: class Event {
    name = 'ump.ExecutedUpward'
    lookupName = 'XcmV2TraitsOutcome'
    lookupIndex = -1
    
    constructor(){}

    check(data, callback = ()=>{}) {
      let reason = data.toString()
      let result = data.isComplete ? OK : FAIL

      callback()
      return `${result}-${this.name}-${reason}`
    }
  }
}