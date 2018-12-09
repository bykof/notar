import {success, failure} from "../libs/response-lib";
import hashGenerator from "./hashGenerator";
import KeyModel from "./keyModel";


export async function main(event, context) {
    try {
        const body = JSON.parse(event.body);
        const hash = hashGenerator(body.firstName, body.lastName, body.birthdayTimestamp, body.pin);
        let result = await new KeyModel().createKey(event.requestContext.identity.cognitoIdentityId, hash);
        return success(result.Item);
    } catch (error) {
        console.log(error);
        return failure({status: false, error: error});
    }
}