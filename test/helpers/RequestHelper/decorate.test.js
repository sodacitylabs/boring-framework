const RequestHelper = require("../../../src/core/helpers/RequestHelper");

test("decorates request based on incoming http information", () => {
  let req = {
    url: "http://www.test.com"
  };

  RequestHelper.decorate(req);

  expect(Object.keys(req.hash)).toHaveLength(0);
  expect(Object.keys(req.query)).toHaveLength(0);
  expect(Object.keys(req.params)).toHaveLength(0);
  expect(req.cookies).toBeUndefined();
  expect(req.path).toBe("/");
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

test("finds index action for GET /articles", () => {
  let req = {
    isBrowserRequest: true,
    method: "GET",
    path: "/articles"
  };
  let result = RequestHelper.getAction(req);

  expect(result.controller).toBe("Articles");
  expect(result.action).toBe("index");
});

test("finds list action for GET /articles", () => {
  let req = {
    isApiRequest: true,
    method: "GET",
    path: "/articles"
  };
  let result = RequestHelper.getAction(req);

  expect(result.controller).toBe("Articles");
  expect(result.action).toBe("list");
});

test("finds create action for POST /articles", () => {
  let req = {
    isApiRequest: true,
    method: "POST",
    path: "/articles"
  };
  let result = RequestHelper.getAction(req);

  expect(result.controller).toBe("Articles");
  expect(result.action).toBe("create");
});

test("finds new action for GET /articles/new", () => {
  let req = {
    isBrowserRequest: true,
    method: "GET",
    path: "/articles/new"
  };
  let result = RequestHelper.getAction(req);

  expect(result.controller).toBe("Articles");
  expect(result.action).toBe("new");
});

test("finds edit action for GET /articles/:id/edit", () => {
  let req = {
    isBrowserRequest: true,
    method: "GET",
    path: "/articles/123/edit",
    params: {}
  };
  let result = RequestHelper.getAction(req);

  expect(result.controller).toBe("Articles");
  expect(result.action).toBe("edit");
  expect(req.params.id).toBe("123");
  expect(req.params.article_id).toBe("123");
});

test("finds show action for GET /articles/:id", () => {
  let req = {
    isBrowserRequest: true,
    method: "GET",
    path: "/articles/123",
    params: {}
  };
  let result = RequestHelper.getAction(req);

  expect(result.controller).toBe("Articles");
  expect(result.action).toBe("show");
  expect(req.params.id).toBe("123");
  expect(req.params.article_id).toBe("123");
});

test("finds find action for GET /articles/:id", () => {
  let req = {
    isApiRequest: true,
    method: "GET",
    path: "/articles/123",
    params: {}
  };
  let result = RequestHelper.getAction(req);

  expect(result.controller).toBe("Articles");
  expect(result.action).toBe("find");
  expect(req.params.id).toBe("123");
  expect(req.params.article_id).toBe("123");
});

test("finds update action for PUT /articles/:id", () => {
  let req = {
    isApiRequest: true,
    method: "PUT",
    path: "/articles/123",
    params: {}
  };
  let result = RequestHelper.getAction(req);

  expect(result.controller).toBe("Articles");
  expect(result.action).toBe("update");
  expect(req.params.id).toBe("123");
  expect(req.params.article_id).toBe("123");
});

test("finds destroy action for DELETE /articles/:id", () => {
  let req = {
    isApiRequest: true,
    method: "DELETE",
    path: "/articles/123",
    params: {}
  };
  let result = RequestHelper.getAction(req);

  expect(result.controller).toBe("Articles");
  expect(result.action).toBe("destroy");
  expect(req.params.id).toBe("123");
  expect(req.params.article_id).toBe("123");
});

test("maps params properly for /blog_posts/:id/comments", () => {
  let req = {
    isApiRequest: true,
    method: "POST",
    path: "/blog_posts/1/comments",
    params: {}
  };
  let result = RequestHelper.getAction(req);

  expect(result.controller).toBe("Comments");
  expect(result.action).toBe("create");
  expect(req.params.blog_post_id).toBe("1");
});
