import AWS from 'aws-sdk';
import uuid from 'uuid';


export default class KeyModel {
    constructor() {
        this.documentClient = new AWS.DynamoDB.DocumentClient();
    }

    async getKeysByUserId(userId) {
        return this.documentClient.scan(
            {
                TableName: 'keys',
                ExpressionAttributeValues: {
                    ':userId': userId,
                },
                FilterExpression: 'userId = :userId',
            }
        ).promise()
    }

    async deactiveKeys(keys) {
        for (const key of keys) {
            await this.documentClient.update(
                {
                    TableName: 'keys',
                    Key: {
                        keyId: key.keyId
                    },
                    UpdateExpression: 'set active = :false',
                    ExpressionAttributeValues: {
                        ':false': false,
                    },
                }
            ).promise();
        }
    }

    async createKey(userId, hash) {
        const keysResult = await this.getKeysByUserId(userId);
        await this.deactiveKeys(keysResult.Items);
        return this.documentClient.put(
            {
                TableName: 'keys',
                Item: {
                    'keyId': uuid.v1(),
                    'userId': userId,
                    'created': Date.now(),
                    'hash': hash,
                    'active': true
                },
            }
        ).promise()
    }
}