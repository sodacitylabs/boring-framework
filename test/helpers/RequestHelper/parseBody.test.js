const RequestHelper = require("../../../src/core/helpers/RequestHelper");

test("resolves if not POST or PUT", () => {
  let req = {
    url: "http://www.test.com/",
    path: "/",
    method: "GET",
    isBrowserRequest: true
  };

  return RequestHelper.parseBody(req);
});
