import AWS from 'aws-sdk';


export default class EmailService {
    constructor() {
        this.ses = new AWS.SES();
    }

    async sendMail(from, to, subject, content) {
        console.log(`Sending email from ${from} to ${to} with ${subject}`);
        try {
            // This works only with registered email addresses. If you want to sent to any other addresses
            // turn off sandbox mode over amazon ses customer care...
            await this.ses.sendEmail(
                {
                    Source: from,
                    Destination: {
                        ToAddresses: to
                    },
                    Message: {
                        Body: {
                            Text: {
                                Charset: 'UTF-8',
                                Data: content,
                            }
                        },
                        Subject: {
                            Charset: 'UTF-8',
                            Data: subject,
                        }
                    }
                }
            ).promise()
        } catch (error) {
            console.log(error);
        }

    }
}