import { resolve } from 'path';
import nodemailer from 'nodemailer';
import exphbs from 'express-handlebars';
import nodemailshbs from 'nodemailer-express-handlebars';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;
    this.transport = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    const viewPath = resolve(__dirname, '..', 'app', 'views', 'mail');
    this.transport.use(
      'compile',
      nodemailshbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }

  sendMail(message) {
    return this.transport.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
