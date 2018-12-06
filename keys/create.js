import AWS from 'aws-sdk';
import uuid from 'uuid';
import shajs from 'sha.js';

import {success, failure} from "../libs/response-lib";


export async function main(event, context) {
    const body = JSON.parse(event.body);
    const hash = shajs('sha256').update(
        body.firstName + body.lastName
    ).update(
        body.birthday.toString()
    ).update(
        body.pin.toString()
    ).digest('hex');

    const documentClient = new AWS.DynamoDB.DocumentClient();
    const params = {
        TableName: 'keys',
        Item: {
            'keyId': uuid.v1(),
            'userId': event.requestContext.identity.cognitoIdentityId,
            'created': Date.now(),
            'hash': hash,
            'active': true
        },
    };

    try {
        await documentClient.put(params).promise();
        return success(params.Item);
    } catch (error) {
        return failure({status: false, error: error});
    }
}