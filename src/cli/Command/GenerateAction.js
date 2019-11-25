const { spawnSync } = require("child_process");
const Command = require("./Command");
const fs = require("fs");
const CREATING_PREFIX = `Creating  `;
const CoreConfig = require("../../core/Config");

module.exports = class GenerateActionCommand extends Command {
  execute(context) {
    const root = process.cwd();
    const inputs = context.getInput();
    const action = inputs[2];
    const controller = inputs[3];

    requireArguments(root, controller, action);
    validateArguments(root, controller, action);

    const controllers = `${root}/app/controllers`;
    const Controller = require(`${root}/app/controllers/${controller}.js`);

    preventDuplicateAction(Controller, action);
    makeViewsDirectory(root, controller, action);
    writeViewTemplate(root, controller, action);

    const fileContents = buildClassContents(Controller, action);

    overwriteControllerFile(
      root,
      `${controllers}/${controller}.js`,
      Controller,
      fileContents
    );
  }
};

/**
 * @function buildClassContents
 * @private
 * @description accumulates all the class functions and contents
 *
 * @param {class} controller - required controller module
 * @param {string} action - action name to create
 *
 * @throws {Error}
 * @returns {null}
 */
function buildClassContents(controller, action) {
  let match = controller
    .toString()
    .match(
      /(class (\w*)Controller)([\s\w]*)({(\s*))([\w\n\s\t();,{}!#./*@$:=`[\]"|'&_?-]*)(};?)/g
    )[0];

  if (CoreConfig.viewActionNames.indexOf(action) === -1) {
    return `${match.substring(
      0,
      match.length - 1
    )} static async ${action}(req, res) { try { res.code(204).send(); } catch(ex) { res.code(500).send(); } }\n };`;
  } else if (CoreConfig.viewActionNames.indexOf(action) !== -1) {
    return `${match.substring(
      0,
      match.length - 1
    )} static async ${action}(req, res) { try { res.render(); } catch(ex) { res.code(500).send(); } }\n };`;
  }

  return match;
}

/**
 * @function makeViewsDirectory
 * @private
 * @description if view action and first view action for controller, create views subdirectory
 *
 * @param {string} root - root directory to start looking for files
 * @param {string} controller - controller name
 * @param {string} action - action name to create
 *
 * @returns {null}
 */
function makeViewsDirectory(root, controller, action) {
  if (
    CoreConfig.viewActionNames.indexOf(action) !== -1 &&
    !fs.existsSync(`${root}/app/views/${controller}`)
  ) {
    console.log(
      `${CREATING_PREFIX} views folder at ${root}/app/views/${controller}`
    );
    fs.mkdirSync(`${root}/app/views/${controller}`);
  }
}

/**
 * @function preventDuplicateAction
 * @private
 * @description prevents trying to add the same action more than once
 *
 * @param {class} controller - required controller module
 * @param {string} action - action name to create
 *
 * @throws {Error}
 * @returns {null}
 */
function preventDuplicateAction(controller, action) {
  if (
    Object.getOwnPropertyNames(controller).filter(
      p => p.trim() === action.trim()
    ).length
  ) {
    throw new Error(
      `Action ${action} already exists for controller ${controller}.`
    );
  }
}

/**
 * @function overwriteControllerFile
 * @private
 * @description overwrite existing controller class' contents with new contents
 *
 * @param {string} root - root directory to start looking for files
 * @param {string} filePath - filePath to the controller
 * @param {class} controller - the required controller class
 * @param {string} contents - contents of the controller class to recreate
 *
 * @returns {null}
 */
function overwriteControllerFile(root, filePath, controller, contents) {
  let controllerFile = fs.readFileSync(filePath).toString();

  fs.writeFileSync(
    filePath,
    controllerFile.replace(
      /(class (\w*)Controller)([\s\w]*)({(\s*))([\w\n\s\t();,{}!#./*@$:=`[\]"|'&_?-]*)(};?)/g,
      contents
    ),
    "utf8"
  );

  spawnSync(`${root}/node_modules/.bin/prettier "${filePath}" --write`, {
    stdio: `inherit`,
    shell: true,
    cwd: root
  });
}

/**
 * @function requireArguments
 * @private
 * @description check if all values provided and are valid values
 *
 * @param {string} root - root directory to start looking for files
 * @param {string} controller - controller name
 * @param {string} action - action name to create
 *
 * @throws {Error}
 * @returns {null}
 */
function requireArguments(root, controller, action) {
  if (!controller) {
    throw new Error(
      `Generating an action for a controller requires a controller name`
    );
  }

  if (!action) {
    throw new Error(
      `Generating an action for a controller requires an action name`
    );
  }
}

/**
 * @function validateArguments
 * @private
 * @description check if all values are semantically valid
 *
 * @param {string} root - root directory to start looking for files
 * @param {string} controller - controller name
 * @param {string} action - action name to create
 *
 * @throws {Error}
 * @returns {null}
 */
function validateArguments(root, controller, action) {
  if (CoreConfig.actionNames.indexOf(action) === -1) {
    throw new Error(`Action ${action} is not a valid action name.`);
  }

  if (!fs.existsSync(`${root}/app/controllers/${controller}.js`)) {
    throw new Error(`Controller ${controller} does not exist.`);
  }
}

/**
 * @function writeViewTemplate
 * @private
 * @description creates basic view template if action is a view action
 *
 * @param {string} root - root directory to start looking for files
 * @param {string} controller - controller name
 * @param {string} action - action name to create
 *
 * @returns {null}
 */
function writeViewTemplate(root, controller, action) {
  const views = `${root}/app/views`;

  if (CoreConfig.viewActionNames.indexOf(action) !== -1) {
    console.log(
      `${CREATING_PREFIX} view at ${views}/${controller}/${action}.html.ejs`
    );
    fs.writeFileSync(
      `${views}/${controller}/${action}.html.ejs`,
      `<h1>${controller}#${action}</h1>\n<p>Find me in app/views/${controller}/${action}.html.ejs</p>`,
      "utf8"
    );
  }
}