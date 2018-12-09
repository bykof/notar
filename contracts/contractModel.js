import AWS from "aws-sdk";

export default class ContractModel {
    constructor() {
        this.documentClient = new AWS.DynamoDB.DocumentClient();
    }
}