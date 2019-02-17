const UnitTest = require("../../src/test/UnitTest");
const UrlHelper = require("../../src/core/helpers").UrlHelper;

module.exports = class NounHelperTest extends UnitTest {
  constructor() {
    super();
  }

  async "parses url without query or hash"() {
    const parsed = UrlHelper.parse("http://localhost:3000");

    this.assert(parsed.pathname).equals("/");

    return true;
  }

  async "parses url with empty hash"() {
    const parsed = UrlHelper.parse("http://localhost:3000#");

    this.assert(parsed.pathname).equals("/");
    this.assert(typeof parsed.hash).equals("object");
    this.assert(Object.keys(parsed.query).length).equals(0);

    return true;
  }

  async "parses url with single value hash"() {
    const parsed = UrlHelper.parse("http://localhost:3000#foo=bar");

    this.assert(parsed.pathname).equals("/");
    this.assert(typeof parsed.hash).equals("object");
    this.assert(Object.keys(parsed.hash).length).equals(1);
    this.assert(parsed.hash["foo"]).equals("bar");

    return true;
  }

  async "parses url with single value hash without ="() {
    const parsed = UrlHelper.parse("http://localhost:3000#foo");

    this.assert(parsed.pathname).equals("/");
    this.assert(typeof parsed.hash).equals("object");
    this.assert(Object.keys(parsed.hash).length).equals(1);
    this.assert(parsed.hash["foo"]).equals("");

    return true;
  }

  async "parses url with multiple values in hash "() {
    const parsed = UrlHelper.parse("http://localhost:3000#foo=bar&bar=foo");

    this.assert(parsed.pathname).equals("/");
    this.assert(typeof parsed.hash).equals("object");
    this.assert(Object.keys(parsed.hash).length).equals(2);
    this.assert(parsed.hash["foo"]).equals("bar");
    this.assert(parsed.hash["bar"]).equals("foo");

    return true;
  }

  async "parses url with empty query"() {
    const parsed = UrlHelper.parse("http://localhost:3000?");

    this.assert(parsed.pathname).equals("/");
    this.assert(typeof parsed.query).equals("object");
    this.assert(Object.keys(parsed.query).length).equals(0);

    return true;
  }

  async "parses url with single value query"() {
    const parsed = UrlHelper.parse("http://localhost:3000?foo=bar");

    this.assert(parsed.pathname).equals("/");
    this.assert(typeof parsed.query).equals("object");
    this.assert(Object.keys(parsed.query).length).equals(1);
    this.assert(parsed.query["foo"]).equals("bar");

    return true;
  }

  async "parses url with single value query without ="() {
    const parsed = UrlHelper.parse("http://localhost:3000?foo");

    this.assert(parsed.pathname).equals("/");
    this.assert(typeof parsed.query).equals("object");
    this.assert(Object.keys(parsed.query).length).equals(1);
    this.assert(parsed.query["foo"]).equals("");

    return true;
  }

  async "parses url with multiple values in query "() {
    const parsed = UrlHelper.parse("http://localhost:3000?foo=bar&bar=foo");

    this.assert(parsed.pathname).equals("/");
    this.assert(typeof parsed.query).equals("object");
    this.assert(Object.keys(parsed.query).length).equals(2);
    this.assert(parsed.query["foo"]).equals("bar");
    this.assert(parsed.query["bar"]).equals("foo");

    return true;
  }

  async "parses url with query and hash"() {
    const parsed = UrlHelper.parse(
      "http://localhost:3000?foo=bar&bar=foo#foo=bar&bar=foo"
    );

    this.assert(parsed.pathname).equals("/");

    this.assert(typeof parsed.query).equals("object");
    this.assert(Object.keys(parsed.query).length).equals(2);
    this.assert(parsed.query["foo"]).equals("bar");
    this.assert(parsed.query["bar"]).equals("foo");

    this.assert(typeof parsed.hash).equals("object");
    this.assert(Object.keys(parsed.hash).length).equals(2);
    this.assert(parsed.hash["foo"]).equals("bar");
    this.assert(parsed.hash["bar"]).equals("foo");

    return true;
  }
};
