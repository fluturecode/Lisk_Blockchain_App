import React, { Component } from 'react';
import { api } from '../api.js';
import { cryptography, transactions } from '@liskhq/lisk-client';

const networkIdentifier = cryptography.getNetworkIdentifier(
    "23ce0366ef0a14a91e5fd4b1591fc880ffbef9d988ff8bebf8f3666b0c09597d",
    "Lisk",
);

class Transfer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            address: '',
            amount: '',
            nonce: '',
            passphrase: '',
            response: { meta: { status: false }},
            transaction: {},
        };
    }

    handleChange = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    };

    handleSubmit = (event) => {
        event.preventDefault();

        const transferTransaction = new transactions.TransferTransaction({
            asset: {
                recipientId: this.state.address,
                amount: transactions.utils.convertLSKToBeddows(this.state.amount),
            },
            networkIdentifier: networkIdentifier,
            nonce: this.state.nonce,
        });

        transferTransaction.sign(this.state.passphrase);
        api.transactions.broadcast(transferTransaction.toJSON()).then(response => {
            this.setState({response:response});
            this.setState({transaction:transferTransaction});
        }).catch(err => {
            console.log(JSON.stringify(err.errors, null, 2));
        });
    }

    render() {
        return (
            <div>
                <h2>Transfer</h2>
                <p>Send tokens from one account to another.</p>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Recipient:
                        <input type="text" id="address" name="address" onChange={this.handleChange} />
                    </label>
                    <label>
                        Amount (1 = 10^8 tokens):
                        <input type="text" id="amount" name="amount" onChange={this.handleChange} />
                    </label>
                    <label>
                        Nonce:
                        <input type="text" id="nonce" name="nonce" onChange={this.handleChange} />
                    </label>
                    <label>
                        Passphrase:
                        <input type="text" id="passphrase" name="passphrase" onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                {this.state.response.meta.status &&
                <div>
                    <pre>Transaction: {JSON.stringify(this.state.transaction, null, 2)}</pre>
                    <p>Response: {JSON.stringify(this.state.response, null, 2)}</p>
                </div>
                }
            </div>
        );
    }
}
export default Transfer;
