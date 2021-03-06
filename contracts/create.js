import {success, failure} from "../libs/response-lib";
import hashGenerator from "../keys/hashGenerator";
import ContractModel from "./contractModel";
import UserModel from "../users/userModel";


export async function main(event, context) {
    const body = JSON.parse(event.body);
    const hash = hashGenerator(
        body.firstName,
        body.lastName,
        body.birthdayTimestamp,
        body.pin
    );

    try {
        const username = new UserModel().usernameByEvent(event);
        let result = await new ContractModel().create(
            body.email,
            username,
            hash,
            body.contractPDF,
            body.users,
        );
        console.log(result);
        return success(result.Item);
    } catch (error) {
        console.log(error);
        return failure({status: false, error: error});
    }
}