const _ = require("lodash");
const RedirectDecorator = require("../decorators/redirect");
const RenderDecorator = require("../decorators/render");

module.exports = class ResponseHelper {
  static decorate(res, ctx) {
    const args = _.pick(ctx, ["projectDirectory", "controller", "action"]);

    if (!args.projectDirectory || !args.controller || !args.action) {
      throw new Error(
        `Not enough context provided to decorate response object`
      );
    }

    res.redirectTo = RedirectDecorator.bind(res);
    res.render = function(data) {
      RenderDecorator.call(
        this,
        args.projectDirectory,
        args.controller,
        args.action,
        data
      );
    }.bind(res);
  }
};
