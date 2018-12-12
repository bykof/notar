import AWS from "aws-sdk";
import uuid from "uuid";

export default class ContractModel {
    constructor() {
        this.documentClient = new AWS.DynamoDB.DocumentClient();
    }

    create(userId, hash, contractPdf) {

        return this.documentClient.put(
            {
                TableName: 'contracts',
                Item: {
                    contractId: uuid.v1(),
                    createdByUserId: userId,
                    created: Date.now(),
                    users: {
                        [userId]: hash,
                    },
                    hash: null,
                    contractPdf: contractPdf,
                },
            }
        ).promise();
    }
}