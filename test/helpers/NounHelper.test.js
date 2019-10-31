const NounHelper = require("../../src/core/helpers/NounHelper");

test("pluralizes BlogPost to BlogPosts", () => {
  expect(NounHelper.getPluralForm("BlogPost")).toBe("BlogPosts");
});

test("singularizes BlogPosts to BlogPost", () => {
  expect(NounHelper.getSingularForm("BlogPosts")).toBe("BlogPost");
});

test("converts BlogPost to blog_post", () => {
  expect(NounHelper.toSingularResource("BlogPost")).toBe("blog_post");
});

test("converts BlogPosts to blog_post", () => {
  expect(NounHelper.toSingularResource("BlogPosts")).toBe("blog_post");
});

test("converts BlogPost to blog_posts", () => {
  expect(NounHelper.toPluralResource("BlogPost")).toBe("blog_posts");
});

test("converts BlogPosts to blog_posts", () => {
  expect(NounHelper.toPluralResource("BlogPost")).toBe("blog_posts");
});
