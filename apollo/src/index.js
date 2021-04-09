import express from 'express';
import { ApolloServer, gql } from "apollo-server-express";
import { Register, asciiToHex, sendSignTransaction } from "YOUR PATH"


const typeDefs = gql` 
  type Query {
  queryRecord(hash: String!) : String}
  
  type Mutation {
    addNewRecordInBlockchain( hash: String! ): String 
  }`;

const resolvers = {
    Query: {

        queryRecord: async (parent, { hash }, context, _info) => {

            const queryResult = await Register.methods.queryRecord(hash).call();

            console.log(queryResult);
            if (queryResult === "0x0000000000000000000000000000000000000000000000000000000000000000") {
                throw "Record " + hash + " not found in the smart contract."
            }

            return hash;
        },
    },

    Mutation: {
        addNewRecordInBlockchain: async (parent, { hash }, context, _info) => {
            try {
                const dataFunction = await Register.methods.addNewRecord(hash, asciiToHex(Date.now().toString()));
                let transaction = await sendSignTransaction(dataFunction, process.env.MAIN_PRIVATE_KEY /* A MODIFIER DANS VOTRE .env*/, 0)

                if (transaction) {
                    console.log("Transaction added : " + transaction.status + " with hash " + transaction.transactionHash + "and block hash : " + transaction.blockHash);
                }
                return "Transaction added"
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
