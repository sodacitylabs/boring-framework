const Boring = require("../../src/core");

test("exposes the expected API", () => {
  const keys = Object.keys(Boring);
  expect(keys).toHaveLength(3);
  expect(keys).toContain("Controller");
  expect(keys).toContain("Mailer");
  expect(keys).toContain("Model");

  const controllerKeys = Object.keys(Boring["Controller"]);
  expect(controllerKeys).toHaveLength(1);
  expect(controllerKeys).toContain("RequestController");

  const modelKeys = Object.keys(Boring["Model"]);
  expect(modelKeys).toHaveLength(1);
  expect(modelKeys).toContain("ActiveRecord");
});
