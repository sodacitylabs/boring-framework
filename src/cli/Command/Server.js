const Command = require("./Command");
const path = require("path");
const Router = require("../../core/RouterV2");
const Fastify = require("fastify");
const ProcessHelper = require("../../core/helpers/ProcessHelper");
const _ = require("lodash");

module.exports = class ServerCommand extends Command {
  execute(context) {
    const dir = ProcessHelper.cwd();
    const projectConfig = ProcessHelper.require(`${dir}/config`);
    const inputs = context.getInput();
    const reload = inputs[1] && inputs[1] === "--reload";

    if (reload) {
      const nodemon = ProcessHelper.require(`${dir}/node_modules/nodemon`);

      nodemon({});

      nodemon
        .on("start", function() {
          console.log("Server has started");
        })
        .on("quit", function() {
          console.log("Server has quit");
          process.exit();
        })
        .on("restart", function(files) {
          console.log("Server restarted due to: ", files);
        });
    } else {
      const fastify = new Fastify({ logger: true });
      const port = projectConfig.server.port || 3000;
      const start = Date.now();
      const router = new Router(projectConfig, dir);
      const routes = router.load();

      if (_.get(projectConfig, "mailer.default")) {
        ProcessHelper.spawn(`./node_modules/.bin/maildev`, {
          stdio: `inherit`,
          shell: true,
          cwd: dir
        });
      }

      routes.forEach(r => {
        fastify.route(r);
      });

      fastify.register(require("fastify-static"), {
        root: path.join(dir, "public")
      });

      ProcessHelper.spawnSync(
        `cp -R app/assets/images/. public/assets/images`,
        {
          stdio: `inherit`,
          shell: true,
          cwd: dir
        }
      );

      ProcessHelper.spawnSync("kill -9 $(lsof -i tcp:1025) 2> /dev/null", {
        stdio: `inherit`,
        shell: true,
        cwd: dir
      });

      ProcessHelper.spawnSync("kill -9 $(lsof -i tcp:1080) 2> /dev/null", {
        stdio: `inherit`,
        shell: true,
        cwd: dir
      });

      fastify.listen({ port }, err => {
        if (err) {
          fastify.log.error(`server failed to start from ${err.message}`);

          return ProcessHelper.exit(1);
        }

        fastify.log.info(
          `server listening on port ${port}. Startup took ${Date.now() -
            start}ms`
        );
      });
    }
  }
};
