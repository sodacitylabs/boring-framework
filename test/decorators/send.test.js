const SendDecorator = require("../../src/core/decorators/send");

test("performs a 500 if data is not able to be JSON stringified", done => {
  const res = {
    writeHead: code => {
      expect(code).toBe(500);
    },
    end: done
  };

  res.send = SendDecorator.bind(res);
  res.send(200, `#{I think this should throw}`);
});

test("just writes an http code if no data", done => {
  const res = {
    writeHead: function(code) {
      expect(code).toBe(200);
      expect(arguments).toHaveLength(1);
    },
    end: done
  };

  res.send = SendDecorator.bind(res);
  res.send(200);
});

test("writes content headers and json payload if given an object", done => {
  const body = {
    key: "value"
  };
  const res = {
    writeHead: function(code, args) {
      expect(code).toBe(200);
      expect(args["Content-Length"]).toBe(
        Buffer.byteLength(JSON.stringify(body))
      );
      expect(args["Content-Type"]).toBe("application/json");
    },
    write: function(payload) {
      expect(payload).toBe(JSON.stringify(body));
    },
    end: done
  };

  res.send = SendDecorator.bind(res);
  res.send(200, body);
});

test("writes content headers and string payload if given a string", done => {
  const body = "helloworld";
  const res = {
    writeHead: function(code, args) {
      expect(code).toBe(200);
      expect(args["Content-Length"]).toBe(Buffer.byteLength(body));
      expect(args["Content-Type"]).toBe("application/json");
    },
    write: function(payload) {
      expect(payload).toBe(body);
    },
    end: done
  };

  res.send = SendDecorator.bind(res);
  res.send(200, body);
});
