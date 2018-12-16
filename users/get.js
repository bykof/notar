import UserModel from "./userModel";

export async function main(event, context) {
    try {
        console.log(event.requestContext.identity.cognitoIdentityId);
        const users = await new UserModel().all();
        console.log(users);
    } catch (error) {
        console.log('error', error);
    }
}