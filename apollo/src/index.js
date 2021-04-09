import express from 'express';
import { gql } from "apollo-server-express";
import { Register, sendSignTransaction } from "YOUR PATH"
import { web3 } from 'YOUR PATH';
import { ApolloServer } from 'apollo-server-express';


const typeDefs = gql` 
  type Query {
  hello: String
  queryRecord(hash: String!) : String}
  
  type Mutation {
    addNewRecordInBlockchain( hash: String! ): String 
  }`;

const resolvers = {
    Query: {
        hello: () => 'Hello world!',

        queryRecord: async (parent, { hash }, context, _info) => {

            console.log("HELLO !");
            const queryResult = await Register.methods.queryRecord(hash).call(); // .call(); 
            console.log("HELLO CA VA !");

            console.log(queryResult);
            if (queryResult === "0x0000000000000000000000000000000000000000000000000000000000000000") {
                throw "Record NOT FOUND"/* +hash+" not found in the smart contract." */
            }

            // console.log(queryResult);
            return "FIN";
        },
    },

    Mutation: {
        addNewRecordInBlockchain: async (parent, { hash }, context, _info) => {
            try {
                console.log(hash)
                console.log(process.env)
                const dataFunction = await Register.methods.addNewRecord(hash, web3.utils.asciiToHex(Date.now().toString())); //0x323032312F30342F3030");
                let transaction = await sendSignTransaction(dataFunction, "YOUR MAIN PRIVATE KEY"/* process.env.MAIN_PRIVATE_KEY */, 0)

                if (transaction) {
                    console.log("Transaction added : " + transaction.status + " with hash " + transaction.transactionHash + "and block hash : " + transaction.blockHash);
                }
                return "DONE"
            } catch (error) {
                console.log("Error catched in _addNewRecordInBlockchain : ", error);
                throw error
            }
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
    console.log('Now browse to http://localhost:4000' + server.graphqlPath)
);
