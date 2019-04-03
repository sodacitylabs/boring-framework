"use strict";

const _ = require("lodash");
const CoreConfig = require("../core/Config");
const fs = require("fs");

const NounHelper = require("../core/helpers/NounHelper");

module.exports = function() {
  const dir = process.cwd();
  const headers = ["Verb", "URI Pattern", "Controller#Action"];
  let routes = [];
  let maxURILength = 0;
  let maxActionLength = 0;

  if (!fs.existsSync(`${dir}/app/controllers`)) {
    console.log(
      `${_.padEnd(headers[0], 8, " ")}${_.padEnd(
        headers[1],
        25,
        " "
      )}${_.padEnd(headers[2], 25, " ")}`
    );
    return;
  }

  const projectConfig = require(`${dir}/config`);
  const controllers = fs.readdirSync(`${dir}/app/controllers`);

  for (let i = 0; i < controllers.length; i++) {
    const Controller = require(`${dir}/app/controllers/${controllers[i]}`);
    const controllerName = NounHelper.toPluralResource(
      Controller.name.split("Controller")[0]
    );
    const actions = Object.getOwnPropertyNames(Controller)
      .filter(p => CoreConfig.actionNames.indexOf(p) !== -1)
      .sort((a, b) => a[0].localeCompare(b[0]));

    for (let j = 0; j < actions.length; j++) {
      const action = actions[j];

      if (action === "create") {
        const uri = `/${controllerName}`;
        const controllerAction = `${controllerName}#${action}`;

        if (uri.length > maxURILength) {
          maxURILength = uri.length;
        }

        if (controllerAction.length > maxActionLength) {
          maxActionLength = controllerAction.length;
        }

        routes.push({
          verb: "POST",
          uri,
          action: controllerAction
        });
      } else if (action === "destroy") {
        const uri = `/${controllerName}/:id`;
        const controllerAction = `${controllerName}#${action}`;

        if (uri.length > maxURILength) {
          maxURILength = uri.length;
        }

        if (controllerAction.length > maxActionLength) {
          maxActionLength = controllerAction.length;
        }

        routes.push({
          verb: "DELETE",
          uri,
          action: controllerAction
        });
      } else if (action === "edit") {
        const uri = `/${controllerName}/:id/edit`;
        const controllerAction = `${controllerName}#${action}`;

        if (uri.length > maxURILength) {
          maxURILength = uri.length;
        }

        if (controllerAction.length > maxActionLength) {
          maxActionLength = controllerAction.length;
        }

        routes.push({
          verb: "GET",
          uri,
          action: controllerAction
        });
      } else if (action === "find") {
        const uri = `/${controllerName}/:id`;
        const controllerAction = `${controllerName}#${action}`;

        if (uri.length > maxURILength) {
          maxURILength = uri.length;
        }

        if (controllerAction.length > maxActionLength) {
          maxActionLength = controllerAction.length;
        }

        routes.push({
          verb: "GET",
          uri,
          action: controllerAction
        });
      } else if (action === "index") {
        const uri = `/${controllerName}`;
        const controllerAction = `${controllerName}#${action}`;

        if (uri.length > maxURILength) {
          maxURILength = uri.length;
        }

        if (controllerAction.length > maxActionLength) {
          maxActionLength = controllerAction.length;
        }

        routes.push({
          verb: "GET",
          uri,
          action: controllerAction
        });
      } else if (action === "list") {
        const uri = `/${controllerName}`;
        const controllerAction = `${controllerName}#${action}`;

        if (uri.length > maxURILength) {
          maxURILength = uri.length;
        }

        if (controllerAction.length > maxActionLength) {
          maxActionLength = controllerAction.length;
        }

        routes.push({
          verb: "GET",
          uri,
          action: controllerAction
        });
      } else if (action === "new") {
        const uri = `/${controllerName}/new`;
        const controllerAction = `${controllerName}#${action}`;

        if (uri.length > maxURILength) {
          maxURILength = uri.length;
        }

        if (controllerAction.length > maxActionLength) {
          maxActionLength = controllerAction.length;
        }

        routes.push({
          verb: "GET",
          uri,
          action: controllerAction
        });
      } else if (action === "show") {
        const uri = `/${controllerName}/:id`;
        const controllerAction = `${controllerName}#${action}`;

        if (uri.length > maxURILength) {
          maxURILength = uri.length;
        }

        if (controllerAction.length > maxActionLength) {
          maxActionLength = controllerAction.length;
        }

        routes.push({
          verb: "GET",
          uri,
          action: controllerAction
        });
      } else if (action === "update") {
        const uri = `/${controllerName}/:id`;
        const controllerAction = `${controllerName}#${action}`;

        if (uri.length > maxURILength) {
          maxURILength = uri.length;
        }

        if (controllerAction.length > maxActionLength) {
          maxActionLength = controllerAction.length;
        }

        routes.push({
          verb: "PUT",
          uri,
          action: controllerAction
        });
      }
    }
  }

  console.log(
    `${_.padEnd(headers[0], 8, " ")}${_.padEnd(
      headers[1],
      Math.max(25, maxURILength + 5),
      " "
    )}${_.padEnd(headers[2], Math.max(25, maxActionLength + 5), " ")}`
  );

  routes.forEach(r => {
    console.log(
      `${_.padEnd(r.verb, 8, " ")}${_.padEnd(
        r.uri,
        Math.max(25, maxURILength + 5),
        " "
      )}${_.padEnd(r.action, Math.max(25, maxActionLength + 5), " ")}`
    );
  });

  if (projectConfig.routes.root.length) {
    console.log(
      `${"GET".padEnd(8, " ")}${"/".padEnd(
        Math.max(25, maxURILength + 5),
        " "
      )}${_.padEnd(
        _.get(projectConfig, "routes.root"),
        Math.max(25, maxActionLength + 5),
        " "
      )}`
    );
  }
};
