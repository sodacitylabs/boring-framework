"use strict";

module.exports = function(target) {
  if (typeof target === "string") {
    this.writeHead(303, {
      Location: target
    });
    this.end();
  }
};
