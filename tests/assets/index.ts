require('dotenv').config()
const chai = require('chai');
var should = require('chai').should()
import { listenToEvent } from "../../src/common/listenToEvent";
import { getBalance } from '../../src/common/getBalance';
import { dmpQueue, ump } from '../../src/config/eventsEvals';
import { OK, MS_WAIT_FOR_UPDATE } from '../../src/config/constants'
import { eventResultParser } from "../../src/common/eventsResultParser"
import { beforeConnectToProviders } from "../helpers/beforeConnectToProviders";
import { sleep } from "../helpers/sleep";
const { exec } = require("child_process");
const BN = require('bn.js');
chai.use(require('chai-bn')(BN));

const PARA_ID = process.env.PARA_ID_SOURCE
const AMOUNT = 1000000000000
const SENDER_RELAY = "//Alice"
const RECEIVER_PARA = "//Charlie"
const SENDER_PARA = "//Dave"
const RECEIVER_RELAY = "//Bob"
// const ASSET_ID = 101
const MIN_BALANCE = 1000
const ADMIN = '//Dave'
const DECIMALS = 12
const ASSET_NAME = 'NachoCoin'
const ASSET_SYMBOL = 'NC'

describe('Assets', () => {
  
  beforeConnectToProviders(
    { 
      relay: { senderRelay: SENDER_RELAY, receiverRelay: RECEIVER_RELAY },
      para: { senderPara: SENDER_PARA, receiverPara: RECEIVER_PARA }
    }  
  )

  before(async function () {
    const getAssetId = async () => {
      let exists
      let assetId

      do {
        assetId = Math.floor((Math.random() * 100) + 1);
        exists = await this.paraSourceApi.query.assets.asset(assetId)
      } while (exists.isSome)
      
      return assetId
    }

    this.assetId = await getAssetId()
  })

  describe('Create', () => {
    it(
      'should create the asset',
      function(done) {
        exec(
          `yarn dev:assets:create -i ${this.assetId} -a ${ADMIN} -m ${MIN_BALANCE} -s ${SENDER_PARA}`, 
          (error, stdout, stderr) => {
            if (stdout) {
              console.log(stdout)
              let result = eventResultParser(stdout)
              chai.assert.equal(result, OK)
              done()
            }
        });
    });
  });

  describe('Set Metadata', () => {
    it(
      'should set metadata',
      function(done) {
        exec(
          `yarn dev:assets:set-metadata -i ${this.assetId} -n ${ASSET_NAME} -y ${ASSET_SYMBOL} -d ${DECIMALS} -s ${SENDER_PARA}`, 
          (error, stdout, stderr) => {
            if (stdout) {
              console.log(stdout)
              let result = eventResultParser(stdout)
              chai.assert.equal(result, OK)
              done()
            }
        });
    });
  });

  describe('Mint', () => {
    it(
      'should issue tokens',
      function(done) {
        exec(
          `yarn dev:assets:mint -i ${this.assetId} -b ${ADMIN} -a ${AMOUNT} -s ${SENDER_PARA}`, 
          (error, stdout, stderr) => {
            if (stdout) {
              console.log(stdout)
              let result = eventResultParser(stdout)
              chai.assert.equal(result, OK)
              done()
            }
        });
    });
  });
  
  

  //   it('should execute successfuly the Inbound XCM in the Parachain', async function() {
  //     let result = await listenToEvent(this.paraSourceApi, dmpQueue.ExecuteDownward)
  //     console.log(result)
  //     chai.assert.equal(eventResultParser(result), OK)
  //   });

  //   it('should decrease balance in sender Relay Chain account equal or greater than amount', async function() {
  //     let newBalance = await getBalance(this.relaySourceApi, this.senderRelay.address)
  //     let expectedBalance = this.senderRelayBalance.toBn().sub(new BN(AMOUNT))
      
  //     newBalance.toBn().should.be.a.bignumber.that.is.lessThan(expectedBalance)
  //   })

  //   it('should increase balance in receiver Parachain account', async function() {
  //     // We make sure the balance is updated before testing
  //     await sleep(MS_WAIT_FOR_UPDATE)

  //     let newBalance = await getBalance(this.paraSourceApi, this.receiverPara.address)

  //     newBalance.toBn().should.be.a.bignumber.that.is.greaterThan(this.receiverParaBalance)
  //   })
  // });

  // describe('UMP', () => {
  //   it(
  //     'should execute successfuly the Outbound XCM in the Parachain', 
  //     function(done) {
  //       let a = exec(
  //         `yarn dev ump local teleport-asset -s ${SENDER_PARA} -p ${PARA_ID} -b ${RECEIVER_RELAY} -a ${AMOUNT} -f ${ASSET_ID}`, 
  //         (error, stdout, stderr) => {
  //           if (stdout) {
  //             console.log(stdout)
  //             let result = eventResultParser(stdout)
  //             chai.assert.equal(result, OK)
  //             done()
  //           }
  //       });  
  //   })
    
  //   it('should execute successfuly the Inbound XCM in the Relay Chain', async function() {
  //     let result = await listenToEvent(this.relaySourceApi, ump.ExecutedUpward)
  //     console.log(result)
  //     chai.assert.equal(eventResultParser(result), OK)
  //   });

  //   it('should decrease balance in sender Parachain account equal or greater than amount', async function() {
  //     let newBalance = await getBalance(this.paraSourceApi, this.senderPara.address)
  //     let expectedBalance = this.senderRelayBalance.toBn().sub(new BN(AMOUNT))
      
  //     newBalance.toBn().should.be.a.bignumber.that.is.lessThan(expectedBalance)
  //   })

  //   it('should increase balance in receiver Relay Chain account', async function() {
  //     // We make sure the balance is updated before testing
  //     await sleep(MS_WAIT_FOR_UPDATE)

  //     let newBalance = await getBalance(this.relaySourceApi, this.receiverRelay.address)

  //     newBalance.toBn().should.be.a.bignumber.that.is.greaterThan(this.receiverRelayBalance)
  //   })

});