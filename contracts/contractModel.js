import AWS from "aws-sdk";
import uuid from "uuid";
import UserModel from "../users/userModel";


export default class ContractModel {
    constructor() {
        this.documentClient = new AWS.DynamoDB.DocumentClient();
    }

    async create(username, hash, contractPdf, users) {
        let params = {
            TableName: 'contracts',
            Item: {
                contractId: uuid.v1(),
                createdByUserId: username,
                created: Date.now(),
                users: {
                    [username]: hash,
                },
                hash: null,
                contractPdf: contractPdf,
            },
        };

        const allUsers = await new UserModel().all();
        for (const user of users) {
            const userObject = allUsers.Users.find((tempUser) => tempUser.Attributes.Email === user);
            params.users[user] = '';
        }

        return this.documentClient.put(params).promise();
    }
}