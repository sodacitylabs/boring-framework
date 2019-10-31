const ActiveRecord = require("../../src/core/ActiveRecord");

test("returns singular form for model name", () => {
  class BlogPost extends ActiveRecord {
    constructor() {
      super();
    }
  }

  expect(BlogPost.modelName).toBe("BlogPost");
});

test("returns plural form for table name", () => {
  class BlogPost extends ActiveRecord {
    constructor() {
      super();
    }
  }

  expect(BlogPost.tableName).toBe("blog_posts");
});
