import KeyModel from "./keyModel";

const AWS = require('aws-sdk');

import {success, failure} from "../libs/response-lib";

export async function main(event, context) {
    try {
        const result = await new KeyModel().getKeysByUserId(event.requestContext.identity.cognitoIdentityId);
        return success(result.Items);
    } catch (error) {
        console.log(error);
        return failure({status: false, error: error});
    }
}