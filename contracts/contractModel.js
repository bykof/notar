import AWS from "aws-sdk";
import uuid from "uuid";
import UserModel from "../users/userModel";
import EmailService from "../emailService";


export default class ContractModel {
    constructor() {
        this.documentClient = new AWS.DynamoDB.DocumentClient();
    }

    async create(username, hash, contractPDF, users) {
        let params = {
            TableName: 'contracts',
            Item: {
                contractId: uuid.v1(),
                createdByUserId: username,
                created: Date.now(),
                users: {
                    [username]: hash,
                },
                hash: null,
                contractPdf: contractPDF,
            },
        };

        const allUsers = await new UserModel().all();

        for (const user of users) {
            const userObject = allUsers.Users.find(
                (tempUser) => {
                    return tempUser.Attributes.find(
                        (attribute) => attribute.Name === 'email' && attribute.Value === user
                    ) !== undefined;
                }
            );

            if (userObject) {
                params.Item.users[userObject.Username] = null;
                await new EmailService().sendMail(
                    'bykof@me.com',
                    [
                        userObject.Attributes.find((attribute) => attribute.Name === 'email').Value,
                    ],
                    `You were invited to sign a new Contract!`,
                    `Please sign-in in Notar and sign-up your newly contract!`,

                )
            }
        }

        return this.documentClient.put(params).promise();
    }
}