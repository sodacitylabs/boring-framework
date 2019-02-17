"use strict";

const CoreConfig = require("./Config");
const fs = require("fs");
const CookieHelper = require("./helpers/CookieHelper");
const NounHelper = require("./helpers/NounHelper");
const UrlHelper = require("./helpers/UrlHelper");

let routes = []; // private route tree
const fileTypeTranslations = {
  css: "text/css",
  gif: "image/gif",
  jpg: "image/jpg",
  jpeg: "image/jpeg",
  js: "application/javascript",
  png: "image/png",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  txt: "text/plain"
};

class Router {
  /**
   * @description - route incoming http requests to an action
   *
   * @param {*} req - core Node.js request object
   * @param {*} res - core Node.js response object
   */
  static incoming(req, res) {
    console.log(`Incoming ${req.method} request to ${req.url}`);

    const dir = process.cwd();
    const projectConfig = require(`${dir}/config`);
    const urlObj = UrlHelper.parse(req.url);

    req.hash = urlObj.hash;
    req.query = urlObj.query;
    req.cookies = CookieHelper.parse(req);

    if (urlObj.pathname === "/" && !projectConfig.routes.root.length) {
      const welcome = CoreConfig.templates.welcome();

      res.writeHead(200, {
        "Content-Length": Buffer.byteLength(welcome),
        "Content-Type": "text/html"
      });
      return res.end(welcome);
    }

    if (urlObj.pathname === "/" && projectConfig.routes.root.length) {
      const root = projectConfig.routes.root.split("#");

      return invokeAction(req, res, dir, root[0], root[1]);
    }

    if (urlObj.pathname.startsWith("/assets")) {
      return serveAsset(req, res);
    }

    return routeToAction(req, res);
  }

  /**
   * @description - load route tree based on controllers, model associates, etc.
   */
  static load() {
    const dir = process.cwd();

    if (!fs.existsSync(`${dir}/app/controllers`)) {
      throw new Error(
        `Cannot locate app/controllers in directory ${dir}. Ensure Boring was started in the same filepath as your package.json and that app/controllers exists.`
      );
    }

    const controllers = fs.readdirSync(`${dir}/app/controllers`);

    for (var i = 0; i < controllers.length; i++) {
      const Controller = require(`${dir}/app/controllers/${controllers[i]}`);
      const controllerName = Controller.name.split("Controller")[0];
      const actions = Object.getOwnPropertyNames(Controller)
        .filter(p => CoreConfig.actionNames.indexOf(p) !== -1)
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
        // const splitAction = actions[j].split(".");
        const action = actions[j];

        switch (action) {
          case "create":
            routes[controllerName].handlers.push({
              verb: "POST",
              accepts: "application/json",
              fn: Controller[action]
            });
            break;
          case "destroy":
            routes[controllerName][":id"].handlers.push({
              verb: "DELETE",
              accepts: "application/json",
              fn: Controller[action]
            });
            break;
          case "edit":
            routes[controllerName][":id"]["edit"] = {
              handlers: [
                {
                  verb: "GET",
                  accepts: "application/html",
                  fn: Controller[action]
                }
              ]
            };
            break;
          case "find":
            routes[controllerName][":id"].handlers.push({
              verb: "GET",
              accepts: "application/json",
              fn: Controller[action]
            });
            break;
          case "index":
            routes[controllerName].handlers.push({
              verb: "GET",
              accepts: "application/html",
              fn: Controller[action]
            });
            break;
          case "list":
            routes[controllerName].handlers.push({
              verb: "GET",
              accepts: "application/json",
              fn: Controller[action]
            });
            break;
          case "new":
            routes[controllerName]["new"] = {
              handlers: [
                {
                  verb: "GET",
                  accepts: "application/html",
                  fn: Controller[action]
                }
              ]
            };
            break;
          case "show":
            routes[controllerName][":id"].handlers.push({
              verb: "GET",
              accepts: "application/html",
              fn: Controller[action]
            });
            break;
          case "update":
            routes[controllerName][":id"].handlers.push({
              verb: "PUT",
              accepts: "application/json",
              fn: Controller[action]
            });
            break;
          default:
            break;
        }
      }
    }
  }

  /**
   * @description - return routing tree
   */
  static get routes() {
    return routes;
  }
}

/**
 *
 * Private Functions
 *
 */

function redirectTo(target) {
  if (typeof target === "string") {
    this.writeHead(303, {
      Location: target
    });
    this.end();
  }
}

async function invokeAction(req, res, dir, controller, action) {
  try {
    // todo: normalize the controller
    const Controller = require(`${dir}/app/controllers/${controller}.js`);
    const actionFunction = Controller[action];

    if (typeof actionFunction !== "function") {
      throw new Error(
        `Typeof ${action} for controller ${controller} is not a function`
      );
    }

    res.redirectTo = redirectTo.bind(res);
    res.send = require("./decorators/send").bind(res);
    res.render = function(data) {
      require("./decorators/render").call(this, dir, controller, action, data);
    }.bind(res);

    await parseBody(req);

    actionFunction(req, res);
  } catch (ex) {
    console.error(ex.message);
    const error = CoreConfig.templates.errors.routing(
      `Routing Error`,
      `No route matches [${req.method}] "${req.url}"`
    );
    res.writeHead(404, {
      "Content-Length": Buffer.byteLength(error),
      "Content-Type": "text/html"
    });
    return res.end(error);
  }
}

function parseBody(req) {
  if (["POST", "PUT"].indexOf(req.method) === -1) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    var body = "";

    req.on("data", function(data) {
      body += data;

      if (body.length > 1e6) {
        return reject();
      }
    });

    req.on("end", () => {
      try {
        req.body = JSON.parse(body);

        resolve();
      } catch (ex) {
        reject();
      }
    });
  });
}

function routingError(req, res) {
  const error = CoreConfig.templates.errors.routing(
    `Routing Error`,
    `No route matches [${req.method}] "${req.url}"`
  );
  res.writeHead(200, {
    "Content-Length": Buffer.byteLength(error),
    "Content-Type": "text/html"
  });
  res.end(error);
}

function routeToAction(req, res) {
  const dir = process.cwd();
  const urlObj = UrlHelper.parse(req.url);
  const urlArray = urlObj.pathname.split("/").splice(1);
  const browserRequest = req.headers.accept.indexOf("html") !== -1;
  const apiRequest = req.headers.accept.indexOf("json") !== -1;

  /**
   * @description - recurses down the routes tree to match URL against
   *
   * @param {*} tree - current subtree of routes we're inspecting
   * @param {*} idx - current index of the split URL were at
   */
  function recurse(idx) {
    const controller = NounHelper.fromResourcePluralToNamePlural(urlArray[idx]);

    if (!routes[controller]) {
      return routingError(req, res);
    }

    if (!req.params) {
      req.params = {};
    }

    // GET /articles
    if (req.method === "GET" && urlArray.length === idx + 1 && browserRequest) {
      return invokeAction(req, res, dir, controller, "index");
    }

    // GET /articles
    if (req.method === "GET" && urlArray.length === idx + 1 && apiRequest) {
      return invokeAction(req, res, dir, controller, "list");
    }

    // POST /articles
    if (req.method === "POST" && urlArray.length === idx + 1 && apiRequest) {
      return invokeAction(req, res, dir, controller, "create");
    }

    // GET /articles/new
    if (
      req.method === "GET" &&
      urlArray.length === idx + 2 &&
      urlArray[idx + 1] === "new" &&
      browserRequest
    ) {
      return invokeAction(req, res, dir, controller, "new");
    }

    // GET /articles/:id/edit
    if (
      req.method === "GET" &&
      urlArray.length === idx + 3 &&
      urlArray[idx + 2] === "edit" &&
      browserRequest
    ) {
      if (idx === 0) {
        req.params.id = urlArray[1];
      } else {
        req.params[`${controller.slice(0, controller.length - 1)}_id`] =
          urlArray[idx + 1];
      }

      return invokeAction(req, res, dir, controller, "edit");
    }

    // GET /articles/:id
    // GET /articles/:id/comments/:id
    if (req.method === "GET" && urlArray.length === idx + 2 && browserRequest) {
      if (idx === 0) {
        req.params.id = urlArray[1];
      } else {
        req.params[`${controller.slice(0, controller.length - 1)}_id`] =
          urlArray[idx + 1];
      }

      return invokeAction(req, res, dir, controller, "show");
    }

    // GET /articles/:id
    // GET /articles/:id/comments/:id
    if (req.method === "GET" && urlArray.length === idx + 2 && apiRequest) {
      if (idx === 0) {
        req.params.id = urlArray[1];
      } else {
        req.params[`${controller.slice(0, controller.length - 1)}_id`] =
          urlArray[idx + 1];
      }

      return invokeAction(req, res, dir, controller, "find");
    }

    // PUT /articles/:id
    // PUT /articles/:id/comments/:id
    if (req.method === "PUT" && urlArray.length === idx + 2 && apiRequest) {
      if (idx === 0) {
        req.params.id = urlArray[1];
      } else {
        req.params[`${controller.slice(0, controller.length - 1)}_id`] =
          urlArray[idx + 1];
      }

      return invokeAction(req, res, dir, controller, "update");
    }

    // DELETE /articles/:id
    // DELETE /articles/:id/comments/:id
    if (req.method === "DELETE" && urlArray.length === idx + 2 && apiRequest) {
      if (idx === 0) {
        req.params.id = urlArray[1];
      } else {
        req.params[`${controller.slice(0, controller.length - 1)}_id`] =
          urlArray[idx + 1];
      }

      return invokeAction(req, res, dir, controller, "destroy");
    }

    if (controller) {
      req.params[`${controller.slice(0, controller.length - 1)}_id`] =
        urlArray[idx + 1];
    }

    recurse(idx + 2);
  }

  recurse(0);
}

function serveAsset(req, res) {
  try {
    const dir = process.cwd();
    const urlObj = UrlHelper.parse(req.url);
    const assetPath = urlObj.pathname.split("/assets/").splice(1)[0];
    const asset = fs.readFileSync(`${dir}/public/assets/${assetPath}`);
    const ext = assetPath.split(".").splice(1)[0];
    const type = fileTypeTranslations[ext] || undefined;

    if (asset && type) {
      res.writeHead(200, {
        "Content-Length": Buffer.byteLength(asset),
        "Content-Type": type,
        "Cache-Control": "public, max-age=31557600"
      });
      res.write(asset, "binary");
      res.end();
    } else {
      throw new Error(`asset not found`);
    }
  } catch (ex) {
    res.writeHead(400, {
      "Content-Length": Buffer.byteLength("")
    });
    res.write("");
    res.end();
  }
}

module.exports = Router;
