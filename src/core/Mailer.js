const dir = process.cwd();
const ejs = require("ejs");
const fs = require("fs");
const htmlToText = require("nodemailer-html-to-text").htmlToText;
const nodemailer = require("nodemailer");
const projectConfig = require(`${dir}/config`);

let _transport;

module.exports = class Mailer {
  static get transport() {
    if (!_transport) {
      switch (projectConfig.mailer.plugin) {
        case "smtp":
          _transport = nodemailer.createTransport(
            require("nodemailer-smtp-transport")(projectConfig.mailer.transport)
          );
          _transport.use("compile", htmlToText());
          break;
        case "ses":
          _transport = nodemailer.createTransport(
            require("nodemailer-ses-transport")(projectConfig.mailer.transport)
          );
          _transport.use("compile", htmlToText());
          break;
        default:
          throw new Error(
            `Mailer plugin type of ${
              projectConfig.mailer.plugin
            } is currently not supported`
          );
      }
    }

    return _transport;
  }

  static async deliverLater(path, data, args) {
    process.nextTick(async () => {
      const template = fs.readFileSync(
        `${dir}/app/views/mailers/${path}.html.ejs`,
        "utf8"
      );
      const rendered = ejs.render(template, data, {
        views: [`${dir}/app/views`]
      });

      await this.transport.sendMail(
        Object.assign({}, args, { html: rendered })
      );
    });

    return true;
  }

  static async deliverNow(path, data, args) {
    const template = fs.readFileSync(
      `${dir}/app/views/mailers/${path}.html.ejs`,
      "utf8"
    );
    const rendered = ejs.render(template, data, {
      views: [`${dir}/app/views`]
    });

    return this.transport.sendMail(Object.assign({}, args, { html: rendered }));
  }
};
