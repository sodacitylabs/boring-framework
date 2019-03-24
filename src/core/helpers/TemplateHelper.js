const fs = require("fs");

let _cachedTemplates = {};

module.exports = class TemplateHelper {
  static load(directory, controller, action) {
    if (typeof _cachedTemplates[`${controller}`][`${action}`] !== "undefined") {
      return _cachedTemplates[`${controller}`][`${action}`];
    }

    const template = fs.readFileSync(
      `${directory}/app/views/${controller}/${action}.html.ejs`,
      "utf8"
    );

    _cachedTemplates[`${controller}`][`${action}`] = template;

    return template;
  }
};
