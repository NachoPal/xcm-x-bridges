const polkadotApi = require('@polkadot/api');

const { ApiPromise, WsProvider } = polkadotApi;

const establishConnection = async (url) => {
  const wsProvider = new WsProvider(url);
  const api = await ApiPromise.create({ 
    provider: wsProvider,
    types: {
      "--1": "Rococo Types",
      "RococoBalance": "u128",
      "RococoBlockHash": "H256",
      "RococoBlockNumber": "u32",
      "RococoHeader": "Header",
      "--2": "Wococo Types",
      "WococoBalance": "RococoBalance",
      "WococoBlockHash": "RococoBlockHash",
      "WococoBlockNumber": "RococoBlockNumber",
      "WococoHeader": "RococoHeader",
      "--3": "Common types",
      "Address": "MultiAddress",
      "LookupSource": "MultiAddress",
      "AccountSigner": "MultiSigner",
      "SpecVersion": "u32",
      "RelayerId": "AccountId",
      "SourceAccountId": "AccountId",
      "ImportedHeader": {
        "header": "BridgedHeader",
        "requires_justification": "bool",
        "is_finalized": "bool",
        "signal_hash": "Option<BridgedBlockHash>"
      },
      "AuthoritySet": {
        "authorities": "AuthorityList",
        "set_id": "SetId"
      },
      "Id": "[u8; 4]",
      "ChainId": "Id",
      "LaneId": "Id",
      "MessageNonce": "u64",
      "MessageId": "(Id, u64)",
      "MessageKey": {
        "lane_id": "LaneId",
        "nonce:": "MessageNonce"
      },
      "InboundRelayer": "AccountId",
      "InboundLaneData": {
        "relayers": "Vec<UnrewardedRelayer>",
        "last_confirmed_nonce": "MessageNonce"
      },
      "UnrewardedRelayer": {
        "relayer": "RelayerId",
        "messages": "DeliveredMessages"
      },
      "DeliveredMessages": {
        "begin": "MessageNonce",
        "end": "MessageNonce",
        "dispatch_results": "BitVec"
      },
      "OutboundLaneData": {
        "latest_generated_nonce": "MessageNonce",
        "latest_received_nonce": "MessageNonce",
        "oldest_unpruned_nonce": "MessageNonce"
      },
      "MessageData": {
        "payload": "MessagePayload",
        "fee": "Fee"
      },
      "MessagePayload": "Vec<u8>",
      "BridgedOpaqueCall": "Vec<u8>",
      "OutboundMessageFee": "Fee",
      "OutboundPayload": {
        "spec_version": "SpecVersion",
        "weight": "Weight",
        "origin": "CallOrigin",
        "dispatch_fee_payment": "DispatchFeePayment",
        "call": "BridgedOpaqueCall"
      },
      "CallOrigin": {
        "_enum": {
          "SourceRoot": "()",
          "TargetAccount": "(SourceAccountId, MultiSigner, MultiSignature)",
          "SourceAccount": "SourceAccountId"
        }
      },
      "DispatchFeePayment": {
        "_enum": {
          "AtSourceChain": "()",
          "AtTargetChain": "()"
        }
      },
      "MultiSigner": {
        "_enum": {
          "Ed25519": "H256",
          "Sr25519": "H256",
          "Ecdsa": "[u8;33]"
        }
      },
      "MessagesProofOf": {
        "bridged_header_hash": "BridgedBlockHash",
        "storage_proof": "Vec<StorageProofItem>",
        "lane": "LaneId",
        "nonces_start": "MessageNonce",
        "nonces_end": "MessageNonce"
      },
      "StorageProofItem": "Vec<u8>",
      "MessagesDeliveryProofOf": {
        "bridged_header_hash": "BridgedBlockHash",
        "storage_proof": "Vec<StorageProofItem>",
        "lane": "LaneId"
      },
      "UnrewardedRelayersState": {
        "unrewarded_relayer_entries": "MessageNonce",
        "messages_in_oldest_entry": "MessageNonce",
        "total_messages": "MessageNonce"
      },
      "AncestryProof": "()",
      "MessageFeeData": {
        "lane_id": "LaneId",
        "payload": "OutboundPayload"
      },
      "Precommit": {
        "target_hash": "BridgedBlockHash",
        "target_number": "BridgedBlockNumber"
      },
      "AuthoritySignature": "[u8;64]",
      "AuthorityId": "[u8;32]",
      "SignedPrecommit": {
        "precommit": "Precommit",
        "signature": "AuthoritySignature",
        "id": "AuthorityId"
      },
      "Commit": {
        "target_hash": "BridgedBlockHash",
        "target_number": "BridgedBlockNumber",
        "precommits": "Vec<SignedPrecommit>"
      },
      "GrandpaJustification": {
        "round": "u64",
        "commit": "Commit",
        "votes_ancestries": "Vec<BridgedHeader>"
      },
      "Fee": "RococoBalance",
      "Balance": "RococoBalance",
      "BlockHash": "RococoBlockHash",
      "BlockNumber": "RococoBlockNumber",
      "BridgedBlockHash": "WococoBlockHash",
      "BridgedBlockNumber": "WococoBlockNumber",
      "BridgedHeader": "WococoHeader",
      "Parameter": {
        "_enum": {
          "RococoToWococoConversionRate": "u128"
        }
      }
    }
  });
  return api
}

module.exports = establishConnection