const _ = require("lodash");
const AssetHelper = require("./helpers/AssetHelper");
const Config = require("./Config");
const fs = require("fs");
const RequestHelper = require("./helpers/RequestHelper");
const ResponseHelper = require("./helpers/ResponseHelper");
const NounHelper = require("./helpers/NounHelper");

let projectConfig;
let projectDirectory;
let routes = []; // private route tree

function Router(_projectConfig, _projectDirectory) {
  if (!_projectConfig || typeof _projectConfig !== "object") {
    throw new Error(
      `Cannot create a router instance without a project configuration object`
    );
  }

  if (!_projectDirectory || typeof _projectDirectory !== "string") {
    throw new Error(
      `Cannot create a router instance without a project directory`
    );
  }

  projectConfig = _projectConfig;
  projectDirectory = _projectDirectory;
}

/**
 * @description - load route tree based on controllers, model associates, etc.
 */
Router.prototype.load = function() {
  if (!fs.existsSync(`${projectDirectory}/app/controllers`)) {
    throw new Error(
      `Cannot locate app/controllers in directory ${projectDirectory}. Ensure Boring was started in the same filepath as your package.json and that app/controllers exists.`
    );
  }

  const rootAction = _parseRootAction();

  if (!rootAction) {
    routes.push({
      action: `default`,
      method: "GET",
      url: "/",
      handler: (req, res) => {
        const welcome = Config.templates.welcome();

        return res
          .code(200)
          .header("Content-Length", Buffer.byteLength(welcome))
          .header("Content-Type", "text/html")
          .send(welcome);
      }
    });
  } else {
    routes.push({
      action: `${rootAction.controller}#${rootAction.action}`,
      method: "GET",
      url: "/",
      handler: (req, res) => {
        _invokeAction(req, res, rootAction.controller, rootAction.action);
      }
    });
  }

  const controllerFiles = fs.readdirSync(`${projectDirectory}/app/controllers`);

  for (let i = 0; i < controllerFiles.length; i++) {
    const ControllerDefinition = require(`${projectDirectory}/app/controllers/${controllerFiles[i]}`);
    const controllerName = ControllerDefinition.name.split("Controller")[0];
    const actions = Object.getOwnPropertyNames(ControllerDefinition)
      .filter(p => Config.actionNames.indexOf(p) !== -1)
      .sort((a, b) => a[0].localeCompare(b[0]));

    if (!actions.length) {
      continue;
    }

    for (let j = 0; j < actions.length; j++) {
      const action = actions[j];

      switch (action) {
        case "create":
          routes.push({
            action,
            method: "POST",
            url: `/${NounHelper.toPluralResource(controllerName)}`,
            handler: (req, res) =>
              _invokeAction(req, res, controllerName, action)
          });
          break;
        case "destroy":
          routes.push({
            action,
            method: "DELETE",
            url: `/${NounHelper.toPluralResource(controllerName)}/:id`,
            handler: (req, res) =>
              _invokeAction(req, res, controllerName, action)
          });
          break;
        case "edit":
          routes.push({
            action,
            method: "GET",
            url: `/${NounHelper.toPluralResource(controllerName)}/:id/edit`,
            handler: (req, res) =>
              _invokeAction(req, res, controllerName, action)
          });
          break;
        case "index":
          routes.push({
            action,
            method: "GET",
            url: `/${NounHelper.toPluralResource(controllerName)}`,
            handler: (req, res) =>
              _invokeAction(req, res, controllerName, action)
          });
          break;
        case "new":
          routes.push({
            action,
            method: "GET",
            url: `/${NounHelper.toPluralResource(controllerName)}/new`,
            handler: (req, res) =>
              _invokeAction(req, res, controllerName, action)
          });
          break;
        case "show":
          routes.push({
            action,
            method: "GET",
            url: `/${NounHelper.toPluralResource(controllerName)}/:id`,
            handler: (req, res) =>
              _invokeAction(req, res, controllerName, action)
          });
          break;
        case "update":
          routes.push({
            action,
            method: "PUT",
            url: `/${NounHelper.toPluralResource(controllerName)}/:id`,
            handler: (req, res) =>
              _invokeAction(req, res, controllerName, action)
          });
          break;
        default:
          break;
      }
    }
  }

  return routes;
};

/**
 * @description - return routing tree
 */
Router.prototype.routes = function() {
  return routes;
};

/**
 * @description - reads config object for a root route config and parses that
 */
function _parseRootAction() {
  // TODO: move to ConfigHelper?
  const rootAction = _.get(projectConfig, "routes['/']") || "";

  if (!rootAction || !rootAction.length) {
    return null;
  }

  const split = rootAction.split("#");

  if (split.length !== 2) {
    return null;
  }

  return {
    controller: split[0],
    action: split[1]
  };
}

/**
 * @description - route incoming http requests for "/" to welcome page or declared root action
 *
 * @param {*} req - core Node.js request object
 * @param {*} res - core Node.js response object
 * @param {Number} code - http code to use
 */
function _routingError(req, res, code) {
  const error = Config.templates.errors.routing(
    `Routing Error`,
    `No route matches [${req.method}] "${req.url}"`
  );
  res.writeHead(code, {
    "Content-Length": Buffer.byteLength(error),
    "Content-Type": "text/html"
  });
  res.end(error);
}

/**
 * @description - route incoming http request to a specified controller/action
 *
 * @param {*} req - core Node.js request object
 * @param {*} res - core Node.js response object
 * @param {String} controller - name of the controller file ex. Users => controllers/Users.js
 * @param {String} action - name of the action to invoke for the controller ex. index => Users.index
 */
async function _invokeAction(req, res, controller, action) {
  try {
    // todo: normalize the controller
    const ControllerDefinition = require(`${projectDirectory}/app/controllers/${controller}.js`);
    const actionFunction = ControllerDefinition[action];

    if (typeof actionFunction !== "function") {
      throw new Error(
        `Typeof ${action} for controller ${controller} is not a function`
      );
    }

    ResponseHelper.decorate(res, {
      projectDirectory,
      controller,
      action
    });

    await RequestHelper.parseBody(req);

    actionFunction(req, res);
  } catch (ex) {
    console.error(`Error Invoking Action :: ${ex.message}`);
    _routingError(req, res, 404);
  }
}

module.exports = Router;
