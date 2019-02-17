const UnitTest = require("../../src/test/UnitTest");
const NounHelper = require("../../src/core/helpers").NounHelper;

module.exports = class NounHelperTest extends UnitTest {
  constructor() {
    super();
  }

  async "converts BlogPost to BlogPosts"() {
    return this.assert(NounHelper.getPluralForm("BlogPost")).equals(
      "BlogPosts"
    );
  }

  async "converts BlogPosts to BlogPost"() {
    return this.assert(NounHelper.getSingularForm("BlogPosts")).equals(
      "BlogPost"
    );
  }

  async "converts BlogPost to blog_post"() {
    return this.assert(NounHelper.toSingularResource("BlogPost")).equals(
      "blog_post"
    );
  }

  async "converts BlogPosts to blog_post"() {
    return this.assert(NounHelper.toSingularResource("BlogPosts")).equals(
      "blog_post"
    );
  }

  async "converts BlogPost to blog_posts"() {
    return this.assert(NounHelper.toPluralResource("BlogPost")).equals(
      "blog_posts"
    );
  }

  async "converts BlogPosts to blog_posts"() {
    return this.assert(NounHelper.toPluralResource("BlogPosts")).equals(
      "blog_posts"
    );
  }
};
