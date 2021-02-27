import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer, { Transporter } from 'nodemailer';

type VariablesProps = {
  name: string;
  title: string;
  description: string;
  id: string;
};

class SendMailServices {
  private client: Transporter;

  constructor() {
    nodemailer
      .createTestAccount()
      .then((account) => {
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        });

        this.client = transporter;
      })
      .catch(console.log);
  }

  async execute(
    to: string,
    subject: string,
    variables: VariablesProps,
    path: string
  ) {
    const templateFileContent = fs.readFileSync(path).toString('utf-8');

    const mailTemplatesParse = handlebars.compile(templateFileContent);

    const html = mailTemplatesParse(variables);

    const message = await this.client.sendMail({
      to,
      subject,
      html,
      from: 'NPS <noreplay@nps.com.br>',
    });

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}

export default new SendMailServices();
