import {success, failure} from "../libs/response-lib";
import AWS from 'aws-sdk';
import UserModel from "../users/userModel";


export async function main(event, context) {
    console.log('event', event);
    console.log('context', context);
    console.log(new UserModel().usernameByEvent(event));
    return success({});
}