require('dotenv').config()
const chai = require('chai');
var should = require('chai').should()
import { listenToEvent } from "../../src/common/listenToEvent";
import { getBalance } from '../../src/common/getBalance';
import { dmpQueue, ump } from '../../src/config/eventsEvals';
import { OK } from '../../src/config/constants'
import { eventResultParser } from "../../src/common/eventsResultParser"
import { beforeConnectToProviders } from "../helpers/beforeConnectToProviders";
import { compactAddLength } from '@polkadot/util';
import { u8aToHex } from '@polkadot/util'
import getWallet from '../../src/common/getWallet';
const { exec } = require("child_process");
const BN = require('bn.js');
chai.use(require('chai-bn')(BN));

const PARA_ID = process.env.PARA_ID_SOURCE
const AMOUNT = 1000000000000
const SENDER_RELAY = "//Alice"
const RECEIVER_PARA = "//Bob"
const SENDER_PARA = "//Alice"
const RECEIVER_RELAY = "//Bob"
const SOVEREIGN_ACCOUNT = "5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM"
// const REQUIRED_WEIGHT_AT_MOST = 1000000000
const REQUIRED_WEIGHT_AT_MOST = 1
const ORIGIN_TYPE = 'SovereignAccount'
// const ENCODED_CALL = '0x0600008eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48070010a5d4e8'

describe('Send - Transact', () => {

  beforeConnectToProviders(
    { 
      relay: { senderRelay: SENDER_RELAY, receiverRelay: RECEIVER_RELAY },
      para: { senderPara: SENDER_PARA, receiverPara: RECEIVER_PARA }
    }  
  )
  
  // Only SUDO Account is able to send a Transact XCM to a Parachain
  // The Call will be dispatched by the Sovereign account in the Parachain, which is 5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM or
  // public key: 0x0000000000000000000000000000000000000000000000000000000000000000
  // Thus, the Sovereign Account should have some balance (1K at least for the following samples)
  before(async function() {
    let nonce = await this.paraSourceApi.rpc.system.accountNextIndex(this.senderRelay.address);

    await this.paraSourceApi.tx.balances.transfer(
      SOVEREIGN_ACCOUNT,
      AMOUNT
      ).signAndSend(this.senderRelay, { nonce });

    let call = this.paraSourceApi.tx.balances.transfer(this.receiverPara.address, AMOUNT)
    this.encodedCall = u8aToHex((await call).toU8a().slice(2))
  })

  // En event Eval solo tengo que buscar xcmPallet.Sent e imprimir el contenido, si fallase,
  // solo puedo ver el Event sudo.Sudid
//   Result<Null, SpRuntimeDispatchError>
// {
//   Err: {
//     Module: {
//       index: 99
//       error: 0
//     }
//   }
// }
// Probar sin sudo a ver qiue evento sale
// 

  describe('DMP', () => {
    it(
      'should execute successfuly the Outbound XCM in the Relay Chain',
      function(done) {
        exec(
          `yarn dev dmp local transact -s ${SENDER_RELAY} -p ${PARA_ID} -t ${ORIGIN_TYPE} -w ${REQUIRED_WEIGHT_AT_MOST} -c ${this.encodedCall}`,
          (error, stdout, stderr) => {
            if (stdout) {
              console.log(stdout)
              let result = eventResultParser(stdout)
              chai.assert.equal(result, OK)
              done()
            }
        });
    });

    // it('should execute successfuly the Inbound XCM in the Parachain', async function() {
    //   let result = await listenToEvent(this.paraSourceApi, dmpQueue.ExecuteDownward)
    //   console.log(result)
    //   chai.assert.equal(eventResultParser(result), OK)
    // });

    // it('should decrease balance in sender Relay Chain account equal or greater than amount', async function() {
    //   let newBalance = await getBalance(this.relaySourceApi, SENDER_RELAY)
    //   let expectedBalance = this.senderRelayBalance.toBn().sub(new BN(AMOUNT))
      
    //   newBalance.toBn().should.be.a.bignumber.that.is.lessThan(expectedBalance)
    // })

    // it('should increase balance in receiver Parachain account', async function() {
    //   // We make sure the balance is updated before testing
    //   const sleep = (ms) => {
    //     return new Promise(resolve => setTimeout(resolve, ms));
    //   }
    //   await sleep(15000)

    //   let newBalance = await getBalance(this.paraSourceApi, RECEIVER_PARA)

    //   newBalance.toBn().should.be.a.bignumber.that.is.greaterThan(this.receiverParaBalance)
    // })
  });

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
  //     await sleep(15000)

  //     let newBalance = await getBalance(this.relaySourceApi, RECEIVER_RELAY)

  //     newBalance.toBn().should.be.a.bignumber.that.is.greaterThan(this.receiverRelayBalance)
  //   })
  // });
});