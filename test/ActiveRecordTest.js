const Boring = require("../src/core");
const UnitTest = Boring.Test.UnitTest;

module.exports = class ActiveRecordTest extends UnitTest {
  constructor() {
    super();
  }

  async "returns singular form for model name"() {
    class BlogPost extends Boring.Model.ActiveRecord {
      constructor() {
        super();
      }
    }

    return this.assert(BlogPost.modelName).equals("BlogPost");
  }

  async "returns plural form for table name"() {
    class BlogPost extends Boring.Model.ActiveRecord {
      constructor() {
        super();
      }
    }

    return this.assert(BlogPost.tableName).equals("blog_posts");
  }
};
