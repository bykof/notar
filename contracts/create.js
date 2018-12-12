import {success, failure} from "../libs/response-lib";
import hashGenerator from "../keys/hashGenerator";
import ContractModel from "./contractModel";


export async function main(event, context) {
    const body = JSON.parse(event.body);
    const hash = hashGenerator(body.firstName, body.lastName, body.birthdayTimestamp, body.pin);


    try {
        let result = await new ContractModel().create(
            event.requestContext.identity.cognitoIdentityId,
            hash,
            body.contractPdf,
        );
        return success(result.Item);
    } catch (error) {
        return failure({status: false, error: error});
    }
}