const {
    BaseAsset,
    codec,
} = require('lisk-sdk');
const {
    helloCounterSchema,
    CHAIN_STATE_HELLO_COUNTER
} = require('./schemas');

const HelloAssetID = 0;

class HelloAsset extends BaseAsset {
    name = 'helloAsset';
    id = HelloAssetID;
    schema = {
        $id: 'lisk/hello/asset',
        type: 'object',
        required: ["helloString"],
        properties: {
            helloString: {
                dataType: 'string',
                fieldNumber: 1,
            },
        }
    };

    validate({asset}) {
        if (!asset.helloString || typeof asset.helloString !== 'string' || asset.helloString.length > 64) {
          throw new Error(
                'Invalid "asset.hello" defined on transaction: A string value no longer than 64 characters is expected'
            );
        }
    };

    async apply({ asset, stateStore, reducerHandler, transaction }) {
        const senderAddress = transaction.senderAddress;
        const senderAccount = await stateStore.account.get(senderAddress);

        senderAccount.hello.helloMessage = asset.helloString;
        stateStore.account.set(senderAccount.address, senderAccount);

        let counterBuffer = await stateStore.chain.get(
            CHAIN_STATE_HELLO_COUNTER
        );

        let counter = codec.decode(
            helloCounterSchema,
            counterBuffer
        );

        counter.helloCounter++;

        await stateStore.chain.set(
            CHAIN_STATE_HELLO_COUNTER,
            codec.encode(helloCounterSchema, counter)
        );
    }
}

module.exports = { HelloAsset, HelloAssetID };
