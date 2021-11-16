import nodemailer, { Transporter } from 'nodemailer';

import { IMailProvider } from '../IMailProvider';

class EtherealMailProvider implements IMailProvider {
  private client: Transporter;
  constructor() {
    nodemailer
      .createTestAccount()
      .then(account => {
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass
          }
        });

        this.client = transporter;
      })
      .catch(error => console.error(error));
  }

  async sendMail(to: string, subject: string, body: string): Promise<void> {
    const message = await this.client.sendMail({
      to,
      from: 'Rentx <noreply@rentx.com.br>',
      subject,
      text: body,
      html: body
    });

    console.log(message.messageId);
    console.log(nodemailer.getTestMessageUrl(message));
  }
}

export { EtherealMailProvider };