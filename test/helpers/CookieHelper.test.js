const CookieHelper = require("../../src/core/helpers/CookieHelper");

test("returns undefined if no headers", () => {
  const req = {};
  const cookies = CookieHelper.parse(req);

  expect(cookies).toBeUndefined();
});

test("returns undefined if no cookie headers", () => {
  const req = {
    headers: {}
  };
  const cookies = CookieHelper.parse(req);

  expect(cookies).toBeUndefined();
});

test("returns empty object if no cookies set", () => {
  const req = {
    headers: {
      cookie: ``
    }
  };
  const cookies = CookieHelper.parse(req);

  expect(Object.keys(cookies)).toHaveLength(0);
});

test("returns parse object if cookies set", () => {
  const req = {
    headers: {
      cookie: `test-cookie=true`
    }
  };
  const cookies = CookieHelper.parse(req);

  expect(Object.keys(cookies)).toHaveLength(1);
  expect(cookies["test-cookie"]).toBe("true");
});
