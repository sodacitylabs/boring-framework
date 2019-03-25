const fs = require("fs");

let _cachedTemplates = {};

module.exports = class TemplateHelper {
  static load(directory, controller, action) {
    if (
      _cachedTemplates[`${controller}`] &&
      _cachedTemplates[`${controller}`][`${action}`]
    ) {
      return _cachedTemplates[`${controller}`][`${action}`];
    }

    const template = fs.readFileSync(
      `${directory}/app/views/${controller}/${action}.html.ejs`,
      "utf8"
    );

    if (!_cachedTemplates[`${controller}`]) {
      _cachedTemplates[`${controller}`] = {};
    }

    _cachedTemplates[`${controller}`][`${action}`] = template;

    return template;
  }
};
