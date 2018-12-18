import {success, failure} from "../libs/response-lib";
import hashGenerator from "../keys/hashGenerator";
import ContractModel from "./contractModel";
import UserModel from "../users/userModel";


export async function main(event, context) {
    try {
        const username = new UserModel().usernameByEvent(event);
        let result = await new ContractModel().getContractsByUsername(username);
        return success(result);
    } catch (error) {
        console.log(error);
        return failure({status: false, error: error});
    }
}