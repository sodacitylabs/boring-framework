"use strict";

const Router = require("../core/RouterV2");

module.exports = function() {
  const dir = process.cwd();
  const config = require(`${dir}/config`);
  const headers = ["Verb", "URI Pattern", "Controller#Action"];
  const router = new Router(config, dir);
  let routes = router.load();
  let maxURILength = routes.reduce((acc, curr) => {
    if (curr.url.length > acc.length) {
      acc = curr.url;
    }

    return acc;
  }, "").length;
  let maxActionLength = 10;

  console.log(
    `${headers[0].padEnd(8, " ")}${headers[1].padEnd(
      Math.max(25, maxURILength + 5),
      " "
    )}${headers[2].padEnd(Math.max(25, maxActionLength + 5), " ")}`
  );

  routes.forEach(r => {
    console.log(
      `${r.method.padEnd(8, " ")}${r.url.padEnd(
        Math.max(25, maxURILength + 5),
        " "
      )}${r.action.padEnd(Math.max(25, maxActionLength + 5), " ")}`
    );
  });
};
