import { web3 } from 'YOUR PATH TO Web3.js';
// import contractArtifacts from './Register.json';
import fs from "fs";
let contractArtifacts = JSON.parse(fs.readFileSync('YOUR PATH TO YOUR ABI', 'utf-8'))
// console.log(contractArtifacts);
export const chainId = async () => {
    return await web3.eth.net.getId()
}

const contractAddress = contractArtifacts["networks"]["CHAIN ID"]["address"];

export const Register = new web3.eth.Contract(contractArtifacts["abi"], contractAddress);

let lastBlock = await web3.eth.getBlockNumber()
console.log(lastBlock);
export const asciiToHex = (_ascii) => {
    return web3.utils.asciiToHex(_ascii.toString())
}

export const hexToAscii = (_hex) => {
    return web3.utils.toUtf8(_hex)
}

export const computeHash = (_string) => {
    return web3.utils.sha3(_string)
}

export const sendSignTransaction = async (
    _dataFunction,
    _privKey,
    _nonce,
    _value = 0,
) => {
    try {
        const publicKey = await web3.eth.accounts.privateKeyToAccount(_privKey)
            .address;
        //   console.log(`... Sending signed tx for ${publicKey} who have balance ${await web3.eth.getBalance(   publicKey)} ... `);

        // Todo : use estimateGas to have accurate estimation and not fixed gas
        const gas = 50000; //200000 Math.round(await web3.eth.estimateGas({ data: _dataFunction.encodeABI(), from: publicKey }) * 5)
        // console.log("Gas estimated : ", gas);
        const txObject = {
            from: publicKey,
            to: contractAddress,
            data: _dataFunction ? _dataFunction.encodeABI() : "",
            value: _value,
            gasPrice: 0,
            gas: gas,
            nonce: (await web3.eth.getTransactionCount(publicKey)) + _nonce,
            chainId: await web3.eth.net.getId()
        };

        // Sign the transaction with the private key
        const signed = await web3.eth.accounts.signTransaction(txObject, _privKey);

        // Send the transaction to the blockchain
        const res = web3.eth.sendSignedTransaction(signed.rawTransaction)
            .on("transactionHash", txHash => {
                console.log(`✍️  Signed transaction for ${publicKey} ✔ with hash : ${txHash} ✍️`);
            })
            .on('receipt', receipt => {
                console.log(`✔  Added transaction : ${receipt.status} with hash : ${receipt.transactionHash}  and block hash : ${receipt.blockHash} ✔ `);
                return [receipt,]
            })
            .on("error", error => {
                console.log("Error in sendSignTransaction");
                return [, error];
            });
        if (res[1]) throw res[1]
        return res

    } catch (error) {
        console.log("Error in sendSignTransaction : ");
        return [, error];
    }
};



