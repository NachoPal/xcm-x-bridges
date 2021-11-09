import { OK, FAIL } from './constants'

export const xcmPallet = {
  Attempted: class Event {
    name = 'xcmPallet.Attempted'
    lookupName = 'XcmV2TraitsOutcome'

    constructor(){}

    check(data, callback = ()=>{}) {
      let reason = data.toString()
      let result = data.isComplete ? OK : FAIL

      process.stdout.write(`${result}-${this.name}-${reason}\n`, () => {
        callback(); 
      })
    }
  }
}

export const polkadotXcm = {
  Attempted: class Event {
    name = 'polkadotXcm.Attempted'
    lookupName = 'XcmV2TraitsOutcome'

    constructor(){}

    check(data, callback = ()=>{}) {
      let reason = data.toString()
      let result = data.isComplete ? OK : FAIL

      process.stdout.write(`${result}-${this.name}-${reason}\n`, () => {
        callback(); 
      })
    }
  }
}

export const dmpQueue = {
  ExecuteDownward: class Event {
    name = 'dmpQueue.ExecutedDownward'
    lookupName = 'XcmV2TraitsOutcome'
    
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
    
    constructor(){}

    check(data, callback = ()=>{}) {
      let reason = data.toString()
      let result = data.isComplete ? OK : FAIL

      callback()
      return `${result}-${this.name}-${reason}`
    }
  }
}