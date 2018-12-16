import KeyModel from "./keyModel";

import {success, failure} from "../libs/response-lib";
import UserModel from "../users/userModel";

export async function main(event, context) {
    try {
        const username = new UserModel().usernameByEvent(event);
        const result = await new KeyModel().getKeysByUsername(username);
        return success(result.Items);
    } catch (error) {
        console.log(error);
        return failure({status: false, error: error});
    }
}