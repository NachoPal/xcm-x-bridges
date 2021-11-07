require('dotenv').config()
import { equal } from "assert";
import { listenToEvent } from "../src/common/listenToEvent";
import connectToRelayChains from '../src/common/connectToRelayChains';
import { getApisFromRelays } from '../src/common/getApisFromRelays';
import { dmpQueue, ump } from '../src/config/eventsEvals';
import { OK, FAIL } from '../src/config/constants'
import { eventResultParser } from "../src/common/eventsResultParser"
const { exec } = require("child_process");

const PARA_ID = process.env.PARA_ID_SOURCE
const AMOUNT = 1000000000000
const ACCOUNT_1 = "//Alice"
const ACCOUNT_2 = "//Bob"
const ASSET_ID = 0


before(async function() {
  const relayChains = await connectToRelayChains(process.env.PORT_SOURCE, process.env.PORT_TARGET);
  const paraChains = await connectToRelayChains(process.env.PORT_PARA_SOURCE, process.env.PORT_PARA_TARGET);

  const { sourceApi: relaySourceApi } = getApisFromRelays(relayChains);
  const { sourceApi: paraSourceApi } = getApisFromRelays(paraChains);

  this.paraSourceApi = paraSourceApi
  this.relaySourceApi = relaySourceApi
})

describe('Teleport Assets', () => {
  describe('DMP', () => {
    it(
      'should execute successfuly the Outbound XCM in the Relay Chain', 
      function(done) {
        exec(
          `yarn dev dmp local teleport-asset -s ${ACCOUNT_1} -p ${PARA_ID} -b ${ACCOUNT_1} -a ${AMOUNT} -f ${ASSET_ID}`, 
          (error, stdout, stderr) => {
            if (stdout) {
              console.log(stdout)
              let result = eventResultParser(stdout)
              equal(result, OK)
              done()
            }
        });  
    });

    it('should execute successfuly the Inbound XCM in the Parachain', function(done) {
      listenToEvent(this.paraSourceApi, dmpQueue.ExecuteDownward, done)
    });
    
  });

  describe('UMP', () => {
    it(
      'should execute successfuly the Outbound XCM in the Parachain', 
      function(done) {
        exec(
          `yarn dev ump local teleport-asset -s ${ACCOUNT_2} -p ${PARA_ID} -b ${ACCOUNT_2} -a ${AMOUNT} -f ${ASSET_ID}`, 
          (error, stdout, stderr) => {
            if (stdout) {
              console.log(stdout)
              let result = eventResultParser(stdout)
              equal(result, OK)
              done()
            }
        });  
    })
    
    it('should execute successfuly the Inbound XCM in the Relay Chain', function(done) {
      listenToEvent(this.relaySourceApi, ump.ExecutedUpward, done)
    });
  });
});