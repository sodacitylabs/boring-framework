const Config = require("../../src/core/Config");

test("contains a property for view-based actions", () => {
  expect(Config.viewActionNames).toHaveLength(4);
  expect(Config.viewActionNames).toContain("index");
  expect(Config.viewActionNames).toContain("new");
  expect(Config.viewActionNames).toContain("show");
  expect(Config.viewActionNames).toContain("edit");
});

test("contains a property for all actions", () => {
  expect(Config.actionNames).toHaveLength(9);
  expect(Config.actionNames).toContain("create");
  expect(Config.actionNames).toContain("destroy");
  expect(Config.actionNames).toContain("edit");
  expect(Config.actionNames).toContain("find");
  expect(Config.actionNames).toContain("index");
  expect(Config.actionNames).toContain("list");
  expect(Config.actionNames).toContain("new");
  expect(Config.actionNames).toContain("show");
  expect(Config.actionNames).toContain("update");
});

test("contains a property for all seeded folders", () => {
  expect(Config.seedDirectories).toHaveLength(19);
  expect(Config.seedDirectories).toContain("app");
  expect(Config.seedDirectories).toContain("app/assets");
  expect(Config.seedDirectories).toContain("app/assets/images");
  expect(Config.seedDirectories).toContain("app/controllers");
  expect(Config.seedDirectories).toContain("app/models");
  expect(Config.seedDirectories).toContain("app/views");
  expect(Config.seedDirectories).toContain("app/views/mailers");
  expect(Config.seedDirectories).toContain("bin");
  expect(Config.seedDirectories).toContain("config");
  expect(Config.seedDirectories).toContain("db");
  expect(Config.seedDirectories).toContain("db/migrations");
  expect(Config.seedDirectories).toContain("public");
  expect(Config.seedDirectories).toContain("public/assets");
  expect(Config.seedDirectories).toContain("public/assets/images");
  expect(Config.seedDirectories).toContain("test");
  expect(Config.seedDirectories).toContain("test/controllers");
  expect(Config.seedDirectories).toContain("test/fixtures");
  expect(Config.seedDirectories).toContain("test/helpers");
  expect(Config.seedDirectories).toContain("test/models");
});

test("contains a property for editorconfig", () => {
  expect(Config.templates.editorConfig).toBeDefined();
  expect(typeof Config.templates.editorConfig).toBe("string");
});

test("contains a property for routing errors", () => {
  expect(Config.templates.errors.routing).toBeDefined();
  expect(typeof Config.templates.errors.routing).toBe("function");
  expect(typeof Config.templates.errors.routing()).toBe("string");
});

test("contains a property for empty welcome page", () => {
  expect(Config.templates.welcome).toBeDefined();
  expect(typeof Config.templates.welcome).toBe("function");
  expect(typeof Config.templates.welcome()).toBe("string");
});
