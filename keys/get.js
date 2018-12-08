const AWS = require('aws-sdk');

import {success, failure} from "../libs/response-lib";

export async function main(event, context) {
    const documentClient = new AWS.DynamoDB.DocumentClient();
    const params = {
        TableName: 'keys',
        ExpressionAttributeValues: {
            ':userId': event.requestContext.identity.cognitoIdentityId,
        },
        FilterExpression: 'userId = :userId',
    };

    try {
        const result = await documentClient.scan(params).promise();
        return success(result.Items);
    } catch (error) {
        console.log('ERROR IN RESPONSE: ', error);
        return failure({status: false, error: error});
    }
}