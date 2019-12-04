const Command = require("./Command");
const Router = require("../../core/RouterV2");
const ProcessHelper = require("../../core/helpers/ProcessHelper");

module.exports = class RoutesCommand extends Command {
  execute(context /* eslint-disable-line no-unused-vars */) {
    const { rootDirectory, projectConfig } = requireArguments(context);
    const routes = accumulateRoutes(rootDirectory, projectConfig);

    printRoutes(routes);
  }
};

/**
 * @function requireArguments
 * @private
 * @description check if all values provided and are valid values
 *
 * @param {Context} context - the context object given
 *
 * @throws {Error}
 */
function requireArguments(context /* eslint-disable-line no-unused-vars */) {
  const rootDirectory = ProcessHelper.cwd();
  const projectConfig = ProcessHelper.require(`${rootDirectory}/config`);

  return {
    rootDirectory,
    projectConfig
  };
}

/**
 * @function accumulateRoutes
 * @private
 *
 * @param {string} rootDirectory - directory the new command was run from
 * @param {string} projectConfig - config folder of the project
 *
 * @throws {Error}
 */
function accumulateRoutes(rootDirectory, projectConfig) {
  const router = new Router(projectConfig, rootDirectory);
  const routes = router.load();

  return routes;
}

/**
 * @function printRoutes
 * @private
 *
 * @param {string} rootDirectory - directory the new command was run from
 * @param {string} projectConfig - config folder of the project
 *
 * @throws {Error}
 */
function printRoutes(routes) {
  const maxURILength = routes.reduce((acc, curr) => {
    if (curr.url.length > acc.length) {
      acc = curr.url;
    }
    return acc;
  }, "").length;
  const maxActionLength = 10;
  const VERB_HEADER = "Verb".padEnd(8, " ");
  const URI_HEADER = "URI Pattern".padEnd(Math.max(25, maxURILength + 5), " ");
  const CA_HEADER = "Controller#Action".padEnd(
    Math.max(25, maxActionLength + 5),
    " "
  );

  console.log(`${VERB_HEADER}${URI_HEADER}${CA_HEADER}`);

  routes.forEach(r => {
    const verb = r.method.padEnd(8, " ");
    const url = r.url.padEnd(Math.max(25, maxURILength + 5), " ");
    const controllerAndAction = `${r.controller}#${r.action}`.padEnd(
      Math.max(25, maxActionLength + 5),
      " "
    );

    console.log(`${verb}${url}${controllerAndAction}`);
  });
}
