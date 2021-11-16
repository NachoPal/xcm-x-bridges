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
import { u8aToHex, numberToHex } from '@polkadot/util'
const { exec } = require("child_process");
const BN = require('bn.js');
chai.use(require('chai-bn')(BN));

const PARA_ID = process.env.PARA_ID_SOURCE
const AMOUNT = 1000000000
const SENDER_RELAY = "//Alice"
const RECEIVER_PARA = "//Charlie"
const SENDER_PARA = "//Alice"
const RECEIVER_RELAY = "//Bob"
const SOVEREIGN_ACCOUNT = "5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM"
const REQUIRED_WEIGHT_AT_MOST = 1000000000
const STORAGE_KEY = "0xb422898ac3ef83da3f78bdf77b08a2169a04835360230ca16c5d96970a47e370"

describe('Send - Transact', () => {

  beforeConnectToProviders(
    { 
      relay: { senderRelay: SENDER_RELAY, receiverRelay: RECEIVER_RELAY },
      para: { senderPara: SENDER_PARA, receiverPara: RECEIVER_PARA }
    }  
  )

  describe('DMP', () => {
    describe('Origin Type - SovereignAccount - Transfer Balance', () => {

      // Only SUDO Account is able to send a Transact XCM to a Parachain
      // The Call will be dispatched by the Sovereign account in the Parachain, which is 5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM or
      // public key: 0x0000000000000000000000000000000000000000000000000000000000000000
      // Thus, the Sovereign Account should have some balance
      before(async function() {
        let nonce = await this.paraSourceApi.rpc.system.accountNextIndex(this.senderRelay.address);

        await this.paraSourceApi.tx.balances.transfer(
          SOVEREIGN_ACCOUNT,
          AMOUNT
          ).signAndSend(this.senderRelay, { nonce }, async ({ events = [], status }) => {
            if (status.isInBlock) {
              this.sovereignAccountBalance = await getBalance(this.paraSourceApi, SOVEREIGN_ACCOUNT)
            }
          });
        
        // Call to be dispatch in the Parachain -> Transfer AMOUNT Balance to SENDER_PARA
        let call = this.paraSourceApi.tx.balances.transfer(this.receiverPara.address, AMOUNT)
        this.encodedCall = u8aToHex((await call).toU8a().slice(2))
      })

      it(
        'should execute successfuly the Outbound XCM in the Relay Chain',
        function(done) {
          exec(
            `yarn dev dmp local transact -s ${SENDER_RELAY} -p ${PARA_ID} -t SovereignAccount -w ${REQUIRED_WEIGHT_AT_MOST} -c ${this.encodedCall}`,
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
  
      it('should decrease balance in Sovereign Account Parachain account equal to the amount', async function() {
        // We make sure the balance is updated before testing
        await sleep(MS_WAIT_FOR_UPDATE)
  
        let newBalance = await getBalance(this.paraSourceApi, SOVEREIGN_ACCOUNT)
        let expectedBalance = this.sovereignAccountBalance.toBn().sub(new BN(AMOUNT))
        
        newBalance.toBn().should.be.a.bignumber.that.is.eq(expectedBalance)
      })
  
      it('should increase balance in receiver Parachain account equal to the amount', async function() {
        // We make sure the balance is updated before testing
        await sleep(MS_WAIT_FOR_UPDATE)
  
        let newBalance = await getBalance(this.paraSourceApi, this.receiverPara.address)
        let expectedBalance = this.receiverParaBalance.toBn().add(new BN(AMOUNT))
  
        newBalance.toBn().should.be.a.bignumber.that.is.eq(expectedBalance)
      })
    });

    describe('Origin Type - Superuser - Set Storage', () => {
      // xxHash(Test) 0xb422898ac3ef83da3f78bdf77b08a216 + xxHash(set_storage) 0x9a04835360230ca16c5d96970a47e370
      // Key 0xb422898ac3ef83da3f78bdf77b08a2169a04835360230ca16c5d96970a47e370
      // Encoded call = 0x00060480b422898ac3ef83da3f78bdf77b08a2169a04835360230ca16c5d96970a47e3701002000000

      before(async function() {
        // Generate a randome value to store
        let random = Math.floor((Math.random() * 100) + 1);
        this.storageValue = numberToHex(random, 32)
        let call = this.paraSourceApi.tx.system.setStorage([[STORAGE_KEY, this.storageValue]])
        this.encodedCall = u8aToHex((await call).toU8a().slice(2))
      })

      it(
        'should execute successfuly the Outbound XCM in the Relay Chain',
        function(done) {
          exec(
            `yarn dev dmp local transact -s ${SENDER_RELAY} -p ${PARA_ID} -t Superuser -w ${REQUIRED_WEIGHT_AT_MOST} -c ${this.encodedCall}`,
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

      it('should set storage', async function() {
        await sleep(MS_WAIT_FOR_UPDATE)
        let storageValue = await this.paraSourceApi.rpc.state.getStorage(STORAGE_KEY)

        chai.assert.equal(storageValue.toHuman(), this.storageValue)
      });
    })
  })
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
  //     let newBalance = await getBalance(this.paraSourceApi, SENDER_PARA)
  //     let expectedBalance = this.senderRelayBalance.toBn().sub(new BN(AMOUNT))
      
  //     newBalance.toBn().should.be.a.bignumber.that.is.lessThan(expectedBalance)
  //   })

  //   it('should increase balance in receiver Relay Chain account', async function() {
  //     // We make sure the balance is updated before testing
  //     const sleep = (ms) => {
  //       return new Promise(resolve => setTimeout(resolve, ms));
  //     }
  //     await sleep(MS_WAIT_FOR_UPDATE)

  //     let newBalance = await getBalance(this.relaySourceApi, RECEIVER_RELAY)

  //     newBalance.toBn().should.be.a.bignumber.that.is.greaterThan(this.receiverRelayBalance)
  //   })
  // });
});