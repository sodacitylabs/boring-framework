const { spawn, spawnSync } = require("child_process");
const Command = require("./Command");
const path = require("path");
const Router = require("../../core/RouterV2");
const Fastify = require("fastify");
const ProcessHelper = require("../../core/helpers/ProcessHelper");

module.exports = class ServerCommand extends Command {
  execute(context /* eslint-disable-line no-unused-vars */) {
    const { rootDirectory, projectConfig } = requireArguments(context);
    const fastify = new Fastify({ logger: true });
    const port = projectConfig.get("server.port") || 3000;
    const start = Date.now();
    const router = new Router(projectConfig, rootDirectory);
    const routes = router.load();

    if (projectConfig.get("mailer.default")) {
      spawn(`./node_modules/.bin/maildev`, {
        stdio: `inherit`,
        shell: true,
        cwd: rootDirectory
      });
    }

    routes.forEach(r => {
      fastify.route(r);
    });

    fastify.register(require("fastify-static"), {
      root: path.join(rootDirectory, "public")
    });

    spawnSync(`cp -R app/assets/images/. public/assets/images`, {
      stdio: `inherit`,
      shell: true,
      cwd: rootDirectory
    });

    ProcessHelper.kill(1025);
    ProcessHelper.kill(1080);

    fastify.listen({ port }, err => {
      if (err) {
        fastify.log.error(`server failed to start from ${err.message}`);

        return ProcessHelper.exit(1);
      }

      fastify.log.info(
        `server listening on port ${port}. Startup took ${Date.now() - start}ms`
      );
    });
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
