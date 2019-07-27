const _ = require("lodash");
const CookieHelper = require("./CookieHelper");
const NounHelper = require("./NounHelper");
const UrlHelper = require("./UrlHelper");

module.exports = class RequestHelper {
  static getAction(req) {
    const urlArray = req.path.split("/").splice(1);

    for (let i = 0; i < urlArray.length; i += 2) {
      const controller = NounHelper.fromResourcePluralToNamePlural(urlArray[i]);

      const isIndexAction =
        req.method === "GET" &&
        urlArray.length === i + 1 &&
        req.isBrowserRequest;
      const isListAction =
        req.method === "GET" && urlArray.length === i + 1 && req.isApiRequest;
      const isCreateAction =
        req.method === "POST" && urlArray.length === i + 1 && req.isApiRequest;
      const isNewAction =
        req.method === "GET" &&
        urlArray.length === i + 2 &&
        urlArray[i + 1] === "new" &&
        req.isBrowserRequest;
      const isEditAction =
        req.method === "GET" &&
        urlArray.length === i + 3 &&
        urlArray[i + 2] === "edit" &&
        req.isBrowserRequest;
      const isShowAction =
        req.method === "GET" &&
        urlArray.length === i + 2 &&
        req.isBrowserRequest;
      const isFindAction =
        req.method === "GET" && urlArray.length === i + 2 && req.isApiRequest;
      const isUpdateAction =
        req.method === "PUT" && urlArray.length === i + 2 && req.isApiRequest;
      const isDeleteAction =
        req.method === "DELETE" &&
        urlArray.length === i + 2 &&
        req.isApiRequest;

      if (isIndexAction) {
        return {
          controller,
          action: "index"
        };
      } else if (isListAction) {
        return {
          controller,
          action: "list"
        };
      }

      if (isCreateAction) {
        return {
          controller,
          action: "create"
        };
      }

      if (isNewAction) {
        return {
          controller,
          action: "new"
        };
      }

      if (isEditAction) {
        req.params.id = urlArray[1];
        req.params[
          `${NounHelper.toSingularResource(controller)}_id`.toLowerCase()
        ] = urlArray[i + 1];

        return {
          controller,
          action: "edit"
        };
      }

      if (isShowAction) {
        req.params.id = urlArray[1];
        req.params[
          `${NounHelper.toSingularResource(controller)}_id`.toLowerCase()
        ] = urlArray[i + 1];

        return {
          controller,
          action: "show"
        };
      }

      if (isFindAction) {
        req.params.id = urlArray[1];
        req.params[
          `${NounHelper.toSingularResource(controller)}_id`.toLowerCase()
        ] = urlArray[i + 1];

        return {
          controller,
          action: "find"
        };
      }

      if (isUpdateAction) {
        req.params.id = urlArray[1];
        req.params[
          `${NounHelper.toSingularResource(controller)}_id`.toLowerCase()
        ] = urlArray[i + 1];

        return {
          controller,
          action: "update"
        };
      }

      if (isDeleteAction) {
        req.params.id = urlArray[1];
        req.params[
          `${NounHelper.toSingularResource(controller)}_id`.toLowerCase()
        ] = urlArray[i + 1];

        return {
          controller,
          action: "destroy"
        };
      }

      req.params[
        `${NounHelper.toSingularResource(controller)}_id`.toLowerCase()
      ] = urlArray[i + 1];
    }
  }

  static decorate(req) {
    const urlObj = UrlHelper.parse(req.url);
    const cookieObj = CookieHelper.parse(req);

    _.merge(
      req,
      {
        hash: urlObj.hash,
        path: urlObj.pathname,
        query: urlObj.query,
        params: {}, // this gets populated during the action invocation step
        cookies: cookieObj
      },
      {
        isBrowserRequest:
          (_.get(req, "headers.accept") || "").indexOf("html") !== -1,
        isApiRequest:
          (_.get(req, "headers.accept") || "").indexOf("json") !== -1
      }
    );
  }

  static parseBody(req) {
    if (["POST", "PUT"].indexOf(req.method) === -1) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      var body = "";

      req.on("data", function(data) {
        body += data;

        if (body.length > 1e6) {
          return reject();
        }
      });

      req.on("end", () => {
        try {
          req.body = JSON.parse(body);

          resolve();
        } catch (ex) {
          reject();
        }
      });
    });
  }
};
