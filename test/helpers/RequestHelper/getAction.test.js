const RequestHelper = require("../../../src/core/helpers/RequestHelper");

test("throws if /. expected to be handled upstream.", done => {
  let req = {
    url: "http://www.test.com",
    path: "/",
    method: "GET",
    isBrowserRequest: true
  };

  try {
    RequestHelper.getAction(req);

    done(new Error(`Shouldve thrown`));
  } catch (ex) {
    done();
  }
});

test("correctly handles GET to /blog_posts for browser requests", () => {
  let req = {
    url: "http://www.test.com/blog_posts",
    path: "/blog_posts",
    method: "GET",
    isBrowserRequest: true
  };

  const { controller, action } = RequestHelper.getAction(req);

  expect(controller).toBe("BlogPosts");
  expect(action).toBe("index");
});

test("correctly handles GET to /blog_posts/1/comments for browser requests", () => {
  let req = {
    url: "http://www.test.com/blog_posts/1/comments",
    path: "/blog_posts/1/comments",
    method: "GET",
    params: {},
    isBrowserRequest: true
  };

  const { controller, action } = RequestHelper.getAction(req);

  expect(controller).toBe("Comments");
  expect(action).toBe("index");
});

test("correctly handles GET to /blog_posts for api requests", () => {
  let req = {
    url: "http://www.test.com/blog_posts",
    path: "/blog_posts",
    method: "GET",
    isApiRequest: true
  };

  const { controller, action } = RequestHelper.getAction(req);

  expect(controller).toBe("BlogPosts");
  expect(action).toBe("list");
});

test("correctly handles GET to /blog_posts/1/comments for api requests", () => {
  let req = {
    url: "http://www.test.com/blog_posts/1/comments",
    path: "/blog_posts/1/comments",
    method: "GET",
    params: {},
    isApiRequest: true
  };

  const { controller, action } = RequestHelper.getAction(req);

  expect(controller).toBe("Comments");
  expect(action).toBe("list");
});

test("correctly handles POST to /blog_posts for api requests", () => {
  let req = {
    url: "http://www.test.com/blog_posts",
    path: "/blog_posts",
    method: "POST",
    isApiRequest: true
  };

  const { controller, action } = RequestHelper.getAction(req);

  expect(controller).toBe("BlogPosts");
  expect(action).toBe("create");
});

test("correctly handles POST to /blog_posts/1/comments for api requests", () => {
  let req = {
    url: "http://www.test.com/blog_posts/1/comments",
    path: "/blog_posts/1/comments",
    method: "POST",
    params: {},
    isApiRequest: true
  };

  const { controller, action } = RequestHelper.getAction(req);

  expect(controller).toBe("Comments");
  expect(action).toBe("create");
});

test("correctly handles GET to /blog_posts/new for browser requests", () => {
  let req = {
    url: "http://www.test.com/blog_posts/new",
    path: "/blog_posts/new",
    method: "GET",
    isBrowserRequest: true
  };

  const { controller, action } = RequestHelper.getAction(req);

  expect(controller).toBe("BlogPosts");
  expect(action).toBe("new");
});

test("correctly handles GET to /blog_posts/1/comments/new for browser requests", () => {
  let req = {
    url: "http://www.test.com/blog_posts/1/comments/new",
    path: "/blog_posts/1/comments/new",
    method: "GET",
    params: {},
    isBrowserRequest: true
  };

  const { controller, action } = RequestHelper.getAction(req);

  expect(controller).toBe("Comments");
  expect(action).toBe("new");
});

test("correctly handles GET to /blog_posts/1/edit for browser requests", () => {
  let req = {
    url: "http://www.test.com/blog_posts/1/edit",
    path: "/blog_posts/1/edit",
    method: "GET",
    params: {},
    isBrowserRequest: true
  };

  const { controller, action } = RequestHelper.getAction(req);

  expect(controller).toBe("BlogPosts");
  expect(action).toBe("edit");
});

test("correctly handles GET to /blog_posts/1/comments/1/edit for browser requests", () => {
  let req = {
    url: "http://www.test.com/blog_posts/1/comments/1/edit",
    path: "/blog_posts/1/comments/1/edit",
    method: "GET",
    params: {},
    isBrowserRequest: true
  };

  const { controller, action } = RequestHelper.getAction(req);

  expect(controller).toBe("Comments");
  expect(action).toBe("edit");
});

test("correctly handles GET to /blog_posts/1 for browser requests", () => {
  let req = {
    url: "http://www.test.com/blog_posts/1",
    path: "/blog_posts/1",
    method: "GET",
    params: {},
    isBrowserRequest: true
  };

  const { controller, action } = RequestHelper.getAction(req);

  expect(controller).toBe("BlogPosts");
  expect(action).toBe("show");
});

test("correctly handles GET to /blog_posts/1/comments/1 for browser requests", () => {
  let req = {
    url: "http://www.test.com/blog_posts/1/comments/1",
    path: "/blog_posts/1/comments/1",
    method: "GET",
    params: {},
    isBrowserRequest: true
  };

  const { controller, action } = RequestHelper.getAction(req);

  expect(controller).toBe("Comments");
  expect(action).toBe("show");
});

test("correctly handles GET to /blog_posts/1 for api requests", () => {
  let req = {
    url: "http://www.test.com/blog_posts/1",
    path: "/blog_posts/1",
    method: "GET",
    params: {},
    isApiRequest: true
  };

  const { controller, action } = RequestHelper.getAction(req);

  expect(controller).toBe("BlogPosts");
  expect(action).toBe("find");
});

test("correctly handles GET to /blog_posts/1/comments/1 for api requests", () => {
  let req = {
    url: "http://www.test.com/blog_posts/1/comments/1",
    path: "/blog_posts/1/comments/1",
    method: "GET",
    params: {},
    isApiRequest: true
  };

  const { controller, action } = RequestHelper.getAction(req);

  expect(controller).toBe("Comments");
  expect(action).toBe("find");
});

test("correctly handles PUT to /blog_posts/1 for api requests", () => {
  let req = {
    url: "http://www.test.com/blog_posts/1",
    path: "/blog_posts/1",
    method: "PUT",
    params: {},
    isApiRequest: true
  };

  const { controller, action } = RequestHelper.getAction(req);

  expect(controller).toBe("BlogPosts");
  expect(action).toBe("update");
});

test("correctly handles PUT to /blog_posts/1/comments/1 for api requests", () => {
  let req = {
    url: "http://www.test.com/blog_posts/1/comments/1",
    path: "/blog_posts/1/comments/1",
    method: "PUT",
    params: {},
    isApiRequest: true
  };

  const { controller, action } = RequestHelper.getAction(req);

  expect(controller).toBe("Comments");
  expect(action).toBe("update");
});

test("correctly handles DELETE to /blog_posts/1 for api requests", () => {
  let req = {
    url: "http://www.test.com/blog_posts/1",
    path: "/blog_posts/1",
    method: "DELETE",
    params: {},
    isApiRequest: true
  };

  const { controller, action } = RequestHelper.getAction(req);

  expect(controller).toBe("BlogPosts");
  expect(action).toBe("destroy");
});

test("correctly handles DELETE to /blog_posts/1/comments/1 for api requests", () => {
  let req = {
    url: "http://www.test.com/blog_posts/1/comments/1",
    path: "/blog_posts/1/comments/1",
    method: "DELETE",
    params: {},
    isApiRequest: true
  };

  const { controller, action } = RequestHelper.getAction(req);

  expect(controller).toBe("Comments");
  expect(action).toBe("destroy");
});
