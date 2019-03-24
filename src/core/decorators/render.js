"use strict";

const ejs = require("ejs");
const TemplateHelper = require("../helpers/TemplateHelper");

function linkTo(title, target) {
  return `<a href="${target}">${title}</a>`;
}

/**
 * Function attached to a response object for rending the view
 *
 * @param {*} data - Local values that are referenced in the EJS embedded code
 */
module.exports = function(dir, controller, action, data) {
  try {
    if (!data) {
      data = {};
    }

    const template = TemplateHelper.load(dir, controller, action);
    const rendered = ejs.render(template, Object.assign(data, { linkTo }), {
      views: [`${dir}/app/views`]
    });

    this.writeHead(200, {
      "Content-Length": Buffer.byteLength(rendered),
      "Content-Type": "text/html"
    });
    this.end(rendered);
  } catch (ex) {
    console.error(`Error rendering template: ${ex.message}`);
    this.writeHead(400);
    this.end();
  }
};
