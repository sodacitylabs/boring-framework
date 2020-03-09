const dir = process.cwd();
const ejs = require("ejs");
const fs = require("fs");
const htmlToText = require("nodemailer-html-to-text").htmlToText;
const nodemailer = require("nodemailer");

let _transport;

module.exports = class Mailer {
  static get transport() {
    if (!_transport) {
      const projectConfig = require(`${dir}/config`);

      switch (projectConfig.get("mailer.plugin")) {
        case "smtp":
          _transport = nodemailer.createTransport(
            require("nodemailer-smtp-transport")(
              projectConfig.get("mailer.transport")
            )
          );
          _transport.use("compile", htmlToText());
          break;
        case "ses":
          _transport = nodemailer.createTransport(
            require("nodemailer-ses-transport")(
              projectConfig.get("mailer.transport")
            )
          );
          _transport.use("compile", htmlToText());
          break;
        default:
          throw new Error(
            `Mailer plugin type of ${projectConfig.get(
              "mailer.plugin"
            )} is currently not supported`
          );
      }
    }

    return _transport;
  }

  static async deliverLater(path, data, args) {
    process.nextTick(async () => {
      await this.deliverNow(path, data, args);
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
