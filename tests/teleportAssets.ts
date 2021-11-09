require('dotenv').config()
const chai = require('chai');
var should = require('chai').should()
import { listenToEvent } from "../src/common/listenToEvent";
import connectToRelayChains from '../src/common/connectToRelayChains';
import { getApisFromRelays } from '../src/common/getApisFromRelays';
import { getBalance } from '../src/common/getBalance';
import { dmpQueue, ump } from '../src/config/eventsEvals';
import { OK } from '../src/config/constants'
import { eventResultParser } from "../src/common/eventsResultParser"
const { exec } = require("child_process");
const BN = require('bn.js');
chai.use(require('chai-bn')(BN));

const PARA_ID = process.env.PARA_ID_SOURCE
const AMOUNT = 1000000000000
const SENDER_RELAY = "//Alice"
const RECEIVER_PARA = "//Bob"
const SENDER_PARA = "//Alice"
const RECEIVER_RELAY = "//Bob"
const ASSET_ID = 0

describe('Teleport Assets', () => {
  
  before(async function() {
    const relayChains = await connectToRelayChains(process.env.PORT_SOURCE, process.env.PORT_TARGET);
    const paraChains = await connectToRelayChains(process.env.PORT_PARA_SOURCE, process.env.PORT_PARA_TARGET);
  
    const { sourceApi: relaySourceApi } = getApisFromRelays(relayChains);
    const { sourceApi: paraSourceApi } = getApisFromRelays(paraChains);
  
    this.paraSourceApi = paraSourceApi
    this.relaySourceApi = relaySourceApi
  
    this.senderRelayBalance = await getBalance(relaySourceApi, SENDER_RELAY)
    this.receiverParaBalance = await getBalance(paraSourceApi, RECEIVER_PARA)
  
    this.senderParaBalance = await getBalance(paraSourceApi, SENDER_PARA)
    this.receiverRelayBalance = await getBalance(relaySourceApi, RECEIVER_RELAY)
  })

  describe('DMP', () => {
    it(
      'should execute successfuly the Outbound XCM in the Relay Chain', 
      function(done) {
        exec(
          `yarn dev dmp local teleport-asset -s ${SENDER_RELAY} -p ${PARA_ID} -b ${RECEIVER_PARA} -a ${AMOUNT} -f ${ASSET_ID}`, 
          (error, stdout, stderr) => {
            if (stdout) {
              console.log(stdout)
              let result = eventResultParser(stdout)
              chai.assert.equal(result, OK)
              done()
            }
        });  
    });

    it('should execute successfuly the Inbound XCM in the Parachain', async function() {
      let result = await listenToEvent(this.paraSourceApi, dmpQueue.ExecuteDownward)
      console.log(result)
      chai.assert.equal(eventResultParser(result), OK)
    });

    it('should decrease balance in sender Relay Chain account equal or greater than amount', async function() {
      let newBalance = await getBalance(this.relaySourceApi, SENDER_RELAY)
      let expectedBalance = this.senderRelayBalance.toBn().sub(new BN(AMOUNT))
      
      newBalance.toBn().should.be.a.bignumber.that.is.lessThan(expectedBalance)
    })

    it('should increase balance in receiver ParaChain account', async function() {
      // We make sure the balance is updated before testing
      const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      await sleep(50000)

      let newBalance = await getBalance(this.paraSourceApi, RECEIVER_PARA)

      newBalance.toBn().should.be.a.bignumber.that.is.greaterThan(this.receiverParaBalance)
    })
    
  });

  describe('UMP', () => {
    it(
      'should execute successfuly the Outbound XCM in the Parachain', 
      function(done) {
        let a = exec(
          `yarn dev ump local teleport-asset -s ${SENDER_PARA} -p ${PARA_ID} -b ${RECEIVER_RELAY} -a ${AMOUNT} -f ${ASSET_ID}`, 
          (error, stdout, stderr) => {
            if (stdout) {
              console.log(stdout)
              let result = eventResultParser(stdout)
              chai.assert.equal(result, OK)
              done()
            }
        });  
    })
    
    it('should execute successfuly the Inbound XCM in the Relay Chain', async function() {
      let result = await listenToEvent(this.relaySourceApi, ump.ExecutedUpward)
      console.log(result)
      chai.assert.equal(eventResultParser(result), OK)
    });
  });
});