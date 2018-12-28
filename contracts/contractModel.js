import AWS from "aws-sdk";
import uuid from "uuid";
import UserModel from "../users/userModel";
import EmailService from "../emailService";
import {hashWithHashes} from "../keys/hashGenerator";


export default class ContractModel {
    constructor() {
        this.documentClient = new AWS.DynamoDB.DocumentClient();
    }

    async create(email, username, hash, contractPDF, users) {
        let params = {
            TableName: 'contracts',
            Item: {
                contractId: uuid.v1(),
                createdByUserId: username,
                created: Date.now(),
                users: [
                    {
                        username: username,
                        email: email,
                        hash: hash,
                        signedAt: Date.now(),
                    }
                ],
                hash: null,
                contractPdf: contractPDF,
            },
        };

        const allUsers = await new UserModel().all();

        for (const user of users) {
            const userObject = allUsers.Users.find(
                (tempUser) => {
                    return tempUser.Attributes.find(
                        (attribute) => attribute.Name === 'email' && attribute.Value === user
                    ) !== undefined;
                }
            );

            if (userObject) {
                params.Item.users.push(
                    {
                        email: userObject.Attributes.find((attribute) => attribute.Name === 'email').Value,
                        username: userObject.Username,
                        hash: null,
                        signedAt: null,
                    }
                );

                await new EmailService().sendMail(
                    'bykof@me.com',
                    [
                        userObject.Attributes.find((attribute) => attribute.Name === 'email').Value,
                    ],
                    `You were invited to sign a new Contract!`,
                    `Please sign-in in Notar and sign-up your newly contract!`,
                )
            }
        }

        return this.documentClient.put(params).promise();
    }

    async getContractsByUsername(username) {
        return (await this.documentClient.scan({
            TableName: 'contracts',
        }).promise()).Items.filter((contract) => contract.users.some((user) => user.username));
    }

    async getContract(contractId) {
        return await this.documentClient.get(
            {
                TableName: 'contracts',
                Key: {'contractId': contractId},
            }
        ).promise();
    }

    isUserLastSigner(contract) {
        let counter = 0;

        for (let user of contract.users) {
            if (!user.hash) counter++;
        }

        return counter > 0;
    }

    async signContract(contract) {
        let hash = hashWithHashes(contract.users.map((user) => user.hash));
        let result = await this.documentClient.update({
            TableName: 'contracts',
            Key: {
                contractId: contract.contractId
            },
            ExpressionAttributeValues: {
                ':hash': hash,
            },
            ExpressionAttributeNames: {
                '#hash': 'hash',
            },
            UpdateExpression: 'SET #hash = :hash',
        }).promise();
        console.log(result);
    }

    async signUp(contractId, username, hash) {
        try {
            let contractResult = await this.getContract(contractId);
            let indexOfUser = contractResult.Item.users.findIndex((user) => user.username === username);
            let result = await this.documentClient.update({
                TableName: 'contracts',
                Key: {
                    contractId: contractId
                },
                ExpressionAttributeValues: {
                    ':hash': hash,
                    ':signedAt': Date.now(),
                },
                ExpressionAttributeNames: {
                    '#users': 'users',
                    '#hash': 'hash',
                    '#signedAt': 'signedAt',
                },
                UpdateExpression: 'SET #users[' +
                    indexOfUser +
                    '].#hash = :hash, #users[' +
                    indexOfUser +
                    '].#signedAt = :signedAt',
            }).promise();

            if (this.isUserLastSigner(contractResult.Item)) {
                // Update the contract with new keys!
                contractResult = await this.getContract(contractId);
                await this.signContract(contractResult.Item);
            }
        } catch (error) {
            console.log('Error: ', error);
            return null;
        }

    }
}