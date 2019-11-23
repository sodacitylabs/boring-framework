"use strict";

const Router = require("../../core/RouterV2");
const { spawnSync } = require("child_process");
const fastify = require("fastify")({ logger: true });
const path = require("path");

module.exports = async function() {
  const dir = process.cwd();
  const config = require(`${dir}/config`);
  const port = config.server.port || 3000;
  const start = Date.now();
  const router = new Router(config, dir);
  const routes = router.load();

  routes.forEach(r => {
    fastify.route(r);
  });

  fastify.register(require("fastify-static"), {
    root: path.join(dir, "public")
  });

  spawnSync(`cp -R app/assets/images/. public/assets/images`, {
    stdio: `inherit`,
    shell: true,
    cwd: dir
  });

  fastify.listen({ port }, err => {
    if (err) {
      fastify.log.error(`server failed to start from ${err.message}`);

      return process.exit(1);
    }

    fastify.log.info(
      `server listening on port ${port}. Startup took ${Date.now() - start}ms`
    );
  });
};
