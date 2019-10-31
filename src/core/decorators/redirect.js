"use strict";

module.exports = function(target) {
  // TODO: should this throw instead if no target?
  if (typeof target === "string") {
    this.writeHead(303, {
      Location: target
    });
    this.end();
  }
};
