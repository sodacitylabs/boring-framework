const _ = require("lodash");
const AssetHelper = require("./helpers/AssetHelper");
const Config = require("./Config");
const fs = require("fs");
const RequestHelper = require("./helpers/RequestHelper");
const ResponseHelper = require("./helpers/ResponseHelper");

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
 * @description - route incoming http requests to a controller action
 *
 * @param {*} req - core Node.js request object
 * @param {*} res - core Node.js response object
 */
Router.prototype.incoming = function(req, res) {
  RequestHelper.decorate(req);

  if (req.path === "/") {
    return _routeToRoot(req, res);
  }

  if (req.path.startsWith("/assets")) {
    return AssetHelper.serve(req, res);
  } else if (req.path === "/favicon.ico") {
    return _routingError(req, res, 200);
  }

  _routeToAction(req, res);
};

/**
 * @description - load route tree based on controllers, model associates, etc.
 */
Router.prototype.load = function() {
  if (!fs.existsSync(`${projectDirectory}/app/controllers`)) {
    throw new Error(
      `Cannot locate app/controllers in directory ${projectDirectory}. Ensure Boring was started in the same filepath as your package.json and that app/controllers exists.`
    );
  }

  const controllerFiles = fs.readdirSync(`${projectDirectory}/app/controllers`);

  for (let i = 0; i < controllerFiles.length; i++) {
    const ControllerDefinition = require(`${projectDirectory}/app/controllers/${
      controllerFiles[i]
    }`);
    const controllerName = ControllerDefinition.name.split("Controller")[0];
    const actions = Object.getOwnPropertyNames(ControllerDefinition)
      .filter(p => Config.actionNames.indexOf(p) !== -1)
      .sort((a, b) => a[0].localeCompare(b[0]));

    if (!actions.length) {
      continue;
    }

    routes[controllerName] = {
      handlers: [],
      ":id": {
        handlers: []
      }
    };

    for (let j = 0; j < actions.length; j++) {
      const action = actions[j];

      switch (action) {
        case "create":
          routes[controllerName].handlers.push({
            verb: "POST",
            accepts: "application/json",
            fn: ControllerDefinition[action]
          });
          break;
        case "destroy":
          routes[controllerName][":id"].handlers.push({
            verb: "DELETE",
            accepts: "application/json",
            fn: ControllerDefinition[action]
          });
          break;
        case "edit":
          routes[controllerName][":id"]["edit"] = {
            handlers: [
              {
                verb: "GET",
                accepts: "application/html",
                fn: ControllerDefinition[action]
              }
            ]
          };
          break;
        case "find":
          routes[controllerName][":id"].handlers.push({
            verb: "GET",
            accepts: "application/json",
            fn: ControllerDefinition[action]
          });
          break;
        case "index":
          routes[controllerName].handlers.push({
            verb: "GET",
            accepts: "application/html",
            fn: ControllerDefinition[action]
          });
          break;
        case "list":
          routes[controllerName].handlers.push({
            verb: "GET",
            accepts: "application/json",
            fn: ControllerDefinition[action]
          });
          break;
        case "new":
          routes[controllerName]["new"] = {
            handlers: [
              {
                verb: "GET",
                accepts: "application/html",
                fn: ControllerDefinition[action]
              }
            ]
          };
          break;
        case "show":
          routes[controllerName][":id"].handlers.push({
            verb: "GET",
            accepts: "application/html",
            fn: ControllerDefinition[action]
          });
          break;
        case "update":
          routes[controllerName][":id"].handlers.push({
            verb: "PUT",
            accepts: "application/json",
            fn: ControllerDefinition[action]
          });
          break;
        default:
          break;
      }
    }
  }
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
  const rootAction = _.get(projectConfig, "routes.root") || "";

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
 */
function _routeToRoot(req, res) {
  const rootAction = _parseRootAction();

  if (!rootAction) {
    const welcome = Config.templates.welcome();

    res.writeHead(200, {
      "Content-Length": Buffer.byteLength(welcome),
      "Content-Type": "text/html"
    });
    return res.end(welcome);
  }

  _invokeAction(req, res, rootAction.controller, rootAction.action);
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
    _routingError(req, res, 404);
  }
}

/**
 * @description - parse a request's url to determine the controller / action to route to
 *
 * @param {*} req - core Node.js request object
 * @param {*} res - core Node.js response object
 */
function _routeToAction(req, res) {
  try {
    const [controller, action] = RequestHelper.getAction(req);

    if (!routes[controller]) {
      throw new Error(
        `Controller ${controller} found in URL (${req.url}) does not exist`
      );
    }

    return _invokeAction(req, res, controller, action);
  } catch (ex) {
    return _routingError(req, res, 200);
  }
}

module.exports = Router;
