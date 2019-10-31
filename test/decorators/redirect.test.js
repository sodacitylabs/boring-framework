const RedirectDecorator = require("../../src/core/decorators/redirect");

test("performs a 303 redirect if given a string", done => {
  const location = "/fake-path";
  const res = {
    writeHead: (code, args) => {
      expect(code).toBe(303);
      expect(args.Location).toBe("/fake-path");
    },
    end: done
  };

  res.redirect = RedirectDecorator.bind(res);
  res.redirect(location);
});

test("does nothing if given no value", () => {
  const res = {
    writeHead: () => {
      throw new Error(`Shouldnt get here`);
    },
    end: () => {
      throw new Error(`Shouldnt get here`);
    }
  };

  res.redirect = RedirectDecorator.bind(res);
  res.redirect();
});
