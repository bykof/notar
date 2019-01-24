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
        let result = await new ContractModel().signUp(
            body.contractId,
            username,
            hash,
        );

        switch (result) {
            case null || undefined:
                return failure({status: false, message: 'There was an unexpected error.'});
            case -1:
                return failure({status: false, message: 'Your PIN was not correct.'});
            case true:
                return success();
        }
    } catch (error) {
        console.log(error);
        return failure({status: false, error: error});
    }
}