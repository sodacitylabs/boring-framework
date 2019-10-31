const ResponseHelper = require("../../src/core/helpers/ResponseHelper");

test("decorates request based on incoming http information", () => {
  let res = {
    url: "http://www.test.com"
  };

  ResponseHelper.decorate(res, {
    projectDirectory: "/dir",
    controller: "Articles",
    action: "index"
  });

  expect(typeof res.redirectTo).toBe("function");
  expect(typeof res.send).toBe("function");
  expect(typeof res.render).toBe("function");
});

test("throws if insufficient context", done => {
  let res = {
    url: "http://www.test.com"
  };

  try {
    ResponseHelper.decorate(res, {});
    done(new Error("should throw"));
  } catch (ex) {
    done();
  }
});
