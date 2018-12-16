import AWS from 'aws-sdk';
import uuid from 'uuid';


export default class KeyModel {
    constructor() {
        this.documentClient = new AWS.DynamoDB.DocumentClient();
    }

    async getKeysByUsername(username) {
        return this.documentClient.scan(
            {
                TableName: 'keys',
                ExpressionAttributeValues: {
                    ':username': username,
                },
                FilterExpression: 'username = :username',
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

    async createKey(username, hash) {
        const keysResult = await this.getKeysByUsername(username);
        await this.deactiveKeys(keysResult.Items);
        return this.documentClient.put(
            {
                TableName: 'keys',
                Item: {
                    'keyId': uuid.v1(),
                    'username': username,
                    'created': Date.now(),
                    'hash': hash,
                    'active': true
                },
            }
        ).promise()
    }
}