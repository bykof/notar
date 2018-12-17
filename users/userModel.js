import AWS from 'aws-sdk';


export default class UserModel {
    constructor() {

        this.USER_POOL = 'us-east-1_OEXVswdYB';
        this.serviceProvider = new AWS.CognitoIdentityServiceProvider();
    }

    async all() {
        return await this.serviceProvider.listUsers(
            {
                UserPoolId: this.USER_POOL,
                AttributesToGet: null,
                Limit: 0,
            }
        ).promise();
    }

    usernameByEvent(event) {
        let splittedProvider = event.requestContext.identity.cognitoAuthenticationProvider.split(':');
        return splittedProvider[splittedProvider.length - 1];
    }
}