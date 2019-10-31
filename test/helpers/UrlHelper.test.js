const UrlHelper = require("../../src/core/helpers/UrlHelper");

test("parses url without query or hash", () => {
  const parsed = UrlHelper.parse("http://localhost:3000");

  expect(parsed.pathname).toBe("/");
});

test("parses url with empty hash", () => {
  const parsed = UrlHelper.parse("http://localhost:3000#");

  expect(parsed.pathname).toBe("/");
  expect(typeof parsed.hash).toBe("object");
  expect(Object.keys(parsed.query)).toHaveLength(0);
});

test("parses url with single value hash", () => {
  const parsed = UrlHelper.parse("http://localhost:3000#foo=bar");

  expect(parsed.pathname).toBe("/");
  expect(typeof parsed.hash).toBe("object");
  expect(Object.keys(parsed.hash)).toHaveLength(1);
  expect(parsed.hash["foo"]).toBe("bar");
});

test("parses url with single value hash without =", () => {
  const parsed = UrlHelper.parse("http://localhost:3000#foo");

  expect(parsed.pathname).toBe("/");
  expect(typeof parsed.hash).toBe("object");
  expect(Object.keys(parsed.hash)).toHaveLength(1);
  expect(parsed.hash["foo"]).toBe("");
});

test("parses url with multiple values in hash ", () => {
  const parsed = UrlHelper.parse("http://localhost:3000#foo=bar&bar=foo");

  expect(parsed.pathname).toBe("/");
  expect(typeof parsed.hash).toBe("object");
  expect(Object.keys(parsed.hash)).toHaveLength(2);
  expect(parsed.hash["foo"]).toBe("bar");
  expect(parsed.hash["bar"]).toBe("foo");
});

test("parses url with empty query", () => {
  const parsed = UrlHelper.parse("http://localhost:3000?");

  expect(parsed.pathname).toBe("/");
  expect(typeof parsed.query).toBe("object");
  expect(Object.keys(parsed.query)).toHaveLength(0);
});

test("parses url with single value query", () => {
  const parsed = UrlHelper.parse("http://localhost:3000?foo=bar");

  expect(parsed.pathname).toBe("/");
  expect(typeof parsed.query).toBe("object");
  expect(Object.keys(parsed.query)).toHaveLength(1);
  expect(parsed.query["foo"]).toBe("bar");
});

test("parses url with single value query without =", () => {
  const parsed = UrlHelper.parse("http://localhost:3000?foo");

  expect(parsed.pathname).toBe("/");
  expect(typeof parsed.query).toBe("object");
  expect(Object.keys(parsed.query)).toHaveLength(1);
  expect(parsed.query["foo"]).toBe("");
});

test("parses url with multiple values in query ", () => {
  const parsed = UrlHelper.parse("http://localhost:3000?foo=bar&bar=foo");

  expect(parsed.pathname).toBe("/");
  expect(typeof parsed.query).toBe("object");
  expect(Object.keys(parsed.query)).toHaveLength(2);
  expect(parsed.query["foo"]).toBe("bar");
  expect(parsed.query["bar"]).toBe("foo");
});

test("parses url with query and hash", () => {
  const parsed = UrlHelper.parse(
    "http://localhost:3000?foo=bar&bar=foo#foo=bar&bar=foo"
  );

  expect(parsed.pathname).toBe("/");

  expect(typeof parsed.query).toBe("object");
  expect(Object.keys(parsed.query)).toHaveLength(2);
  expect(parsed.query["foo"]).toBe("bar");
  expect(parsed.query["bar"]).toBe("foo");

  expect(typeof parsed.hash).toBe("object");
  expect(Object.keys(parsed.hash)).toHaveLength(2);
  expect(parsed.hash["foo"]).toBe("bar");
  expect(parsed.hash["bar"]).toBe("foo");
});
