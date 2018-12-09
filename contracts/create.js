import AWS from 'aws-sdk';
import uuid from 'uuid';


import {success, failure} from "../libs/response-lib";
import hashGenerator from "../keys/hashGenerator";


export async function main(event, context) {
    const body = JSON.parse(event.body);
    const hash = hashGenerator(body.firstName, body.lastName, body.birthday, body.pin);

    const documentClient = new AWS.DynamoDB.DocumentClient();
    const params = {
        TableName: 'contracts',
        Item: {
            'contractId': uuid.v1(),
            'createdByUserId': event.requestContext.identity.cognitoIdentityId,
            'created': Date.now(),
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