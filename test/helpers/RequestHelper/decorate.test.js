const RequestHelper = require("../../../src/core/helpers/RequestHelper");

test("decorates request based on incoming http information", () => {
  let req = {
    url: "http://www.test.com"
  };

  RequestHelper.decorate(req);

  expect(req.cookies).toBeUndefined();
  expect(req.isBrowserRequest).toBe(false);
  expect(req.isApiRequest).toBe(false);
});

test("isBrowserRequest if accepts header wants html", () => {
  let req = {
    headers: {
      accept: "text/html"
    },
    url: "http://www.test.com"
  };

  RequestHelper.decorate(req);

  expect(req.isBrowserRequest).toBe(true);
});

test("isApiRequest if accepts header wants json", () => {
  let req = {
    headers: {
      accept: "application/json"
    },
    url: "http://www.test.com"
  };

  RequestHelper.decorate(req);

  expect(req.isApiRequest).toBe(true);
});
