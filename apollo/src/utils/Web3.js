import Web3 from "web3"

//https://github.com/ethereum/web3.js/tree/1.x/packages/web3-providers-ws#usage
const wsOptions = {
    clientConfig: {
        // Useful if requests are large
        // maxReceivedFrameSize: 100000000,   // bytes - default: 1MiB
        // maxReceivedMessageSize: 100000000, // bytes - default: 8MiB

        // Useful to keep a connection alive
        keepalive: true,
        keepaliveInterval: 60000 // ms
    },
    reconnect: {
        auto: true,
        delay: 5000, // ms
        maxAttempts: 5,
        onTimeout: true
    }
}

const web3SocketParams = new Web3.providers.WebsocketProvider("INSERER VOTRE BASIC AUTH + WSS ENDPOINT", wsOptions)
web3SocketParams.on('end', e => console.error('WS End', e));

export const web3 = new Web3(web3SocketParams);
