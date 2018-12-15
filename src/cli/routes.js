"use strict";

const CoreConfig = require("../core/config/index.js");
const fs = require("fs");
const pluralize = require("pluralize");

function getNameForms(name) {
  const singular = pluralize.singular(name);
  const plural = pluralize.plural(name);

  // todo: should only need to make this pass 1 time
  const resourceSingular = singular.split("").reduce((acc, curr, idx) => {
    if (curr === curr.toUpperCase() && idx !== 0) {
      acc += `_${curr.toLowerCase()}`;
    } else if (idx === 0) {
      acc += curr.toLowerCase();
    } else {
      acc += curr;
    }

    return acc;
  }, "");
  const resourcePlural = plural.split("").reduce((acc, curr, idx) => {
    if (curr === curr.toUpperCase() && idx !== 0) {
      acc += `_${curr.toLowerCase()}`;
    } else if (idx === 0) {
      acc += curr.toLowerCase();
    } else {
      acc += curr;
    }

    return acc;
  }, "");

  return {
    singular,
    plural,
    resourceSingular,
    resourcePlural
  };
}

module.exports = function() {
  const dir = process.cwd();
  const headers = ["Verb", "URI Pattern", "Controller#Action"];
  let routes = [];
  let maxURILength = 0;
  let maxActionLength = 0;

  if (!fs.existsSync(`${dir}/app/controllers`)) {
    console.log(
      `${headers[0].padEnd(8, " ")}${headers[1].padEnd(
        25,
        " "
      )}${headers[2].padEnd(25, " ")}`
    );
    return;
  }

  const projectConfig = require(`${dir}/config`);
  const controllers = fs.readdirSync(`${dir}/app/controllers`);

  for (let i = 0; i < controllers.length; i++) {
    const Controller = require(`${dir}/app/controllers/${controllers[i]}`);
    const controllerName = getNameForms(Controller.name.split("Controller")[0])
      .resourcePlural;
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
    `${headers[0].padEnd(8, " ")}${headers[1].padEnd(
      Math.max(25, maxURILength + 5),
      " "
    )}${headers[2].padEnd(Math.max(25, maxActionLength + 5), " ")}`
  );

  routes.forEach(r => {
    console.log(
      `${r.verb.padEnd(8, " ")}${r.uri.padEnd(
        Math.max(25, maxURILength + 5),
        " "
      )}${r.action.padEnd(Math.max(25, maxActionLength + 5), " ")}`
    );
  });

  if (projectConfig.routes.root.length) {
    console.log(
      `${"GET".padEnd(8, " ")}${"/".padEnd(
        Math.max(25, maxURILength + 5),
        " "
      )}${projectConfig.routes.root.padEnd(
        Math.max(25, maxActionLength + 5),
        " "
      )}`
    );
  }
};
