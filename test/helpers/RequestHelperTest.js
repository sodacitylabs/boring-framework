const UnitTest = require("../../src/test/UnitTest");
const RequestHelper = require("../../src/core/helpers/RequestHelper");

module.exports = class RequestHelperTest extends UnitTest {
  constructor() {
    super();
  }

  async "decorates request based on incoming http information"() {
    let req = {
      url: "http://www.test.com"
    };

    RequestHelper.decorate(req);

    this.assert(Object.keys(req.hash).length).equals(0);
    this.assert(Object.keys(req.query).length).equals(0);
    this.assert(Object.keys(req.params).length).equals(0);
    this.assert(req.cookies).equals(undefined);
    this.assert(req.path).equals("/");
    this.assert(req.isBrowserRequest).equals(false);
    this.assert(req.isApiRequest).equals(false);
  }

  async "isBrowserRequest if accepts header wants html"() {
    let req = {
      headers: {
        accept: "text/html"
      },
      url: "http://www.test.com"
    };

    RequestHelper.decorate(req);

    this.assert(req.isBrowserRequest).equals(true);
  }

  async "isApiRequest if accepts header wants json"() {
    let req = {
      headers: {
        accept: "application/json"
      },
      url: "http://www.test.com"
    };

    RequestHelper.decorate(req);

    this.assert(req.isApiRequest).equals(true);
  }

  async "finds index action for GET /articles"() {
    let req = {
      isBrowserRequest: true,
      method: "GET",
      path: "/articles"
    };
    let result = RequestHelper.getAction(req);

    this.assert(result.controller).equals("Articles");
    this.assert(result.action).equals("index");
  }

  async "finds list action for GET /articles"() {
    let req = {
      isApiRequest: true,
      method: "GET",
      path: "/articles"
    };
    let result = RequestHelper.getAction(req);

    this.assert(result.controller).equals("Articles");
    this.assert(result.action).equals("list");
  }

  async "finds create action for POST /articles"() {
    let req = {
      isApiRequest: true,
      method: "POST",
      path: "/articles"
    };
    let result = RequestHelper.getAction(req);

    this.assert(result.controller).equals("Articles");
    this.assert(result.action).equals("create");
  }

  async "finds new action for GET /articles/new"() {
    let req = {
      isBrowserRequest: true,
      method: "GET",
      path: "/articles/new"
    };
    let result = RequestHelper.getAction(req);

    this.assert(result.controller).equals("Articles");
    this.assert(result.action).equals("new");
  }

  async "finds edit action for GET /articles/:id/edit"() {
    let req = {
      isBrowserRequest: true,
      method: "GET",
      path: "/articles/123/edit",
      params: {}
    };
    let result = RequestHelper.getAction(req);

    this.assert(result.controller).equals("Articles");
    this.assert(result.action).equals("edit");
    this.assert(req.params.id).equals("123");
    this.assert(req.params.article_id).equals("123");
  }

  async "finds show action for GET /articles/:id"() {
    let req = {
      isBrowserRequest: true,
      method: "GET",
      path: "/articles/123",
      params: {}
    };
    let result = RequestHelper.getAction(req);

    this.assert(result.controller).equals("Articles");
    this.assert(result.action).equals("show");
    this.assert(req.params.id).equals("123");
    this.assert(req.params.article_id).equals("123");
  }

  async "finds find action for GET /articles/:id"() {
    let req = {
      isApiRequest: true,
      method: "GET",
      path: "/articles/123",
      params: {}
    };
    let result = RequestHelper.getAction(req);

    this.assert(result.controller).equals("Articles");
    this.assert(result.action).equals("find");
    this.assert(req.params.id).equals("123");
    this.assert(req.params.article_id).equals("123");
  }

  async "finds update action for PUT /articles/:id"() {
    let req = {
      isApiRequest: true,
      method: "PUT",
      path: "/articles/123",
      params: {}
    };
    let result = RequestHelper.getAction(req);

    this.assert(result.controller).equals("Articles");
    this.assert(result.action).equals("update");
    this.assert(req.params.id).equals("123");
    this.assert(req.params.article_id).equals("123");
  }

  async "finds destroy action for DELETE /articles/:id"() {
    let req = {
      isApiRequest: true,
      method: "DELETE",
      path: "/articles/123",
      params: {}
    };
    let result = RequestHelper.getAction(req);

    this.assert(result.controller).equals("Articles");
    this.assert(result.action).equals("destroy");
    this.assert(req.params.id).equals("123");
    this.assert(req.params.article_id).equals("123");
  }

  async "maps params properly for /blog_posts/:id/comments"() {
    let req = {
      isApiRequest: true,
      method: "POST",
      path: "/blog_posts/1/comments",
      params: {}
    };
    let result = RequestHelper.getAction(req);

    this.assert(result.controller).equals("Comments");
    this.assert(result.action).equals("create");
    this.assert(req.params.blog_post_id).equals("1");
  }
};
