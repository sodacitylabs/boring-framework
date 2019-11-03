const TemplateHelper = require("../../src/core/helpers/TemplateHelper");
const fs = require("fs");

jest.mock("fs");

afterEach(() => {
  jest.clearAllMocks();
});

test("loads templates from filesystem. caches for subsequent calls.", () => {
  const mockTemplate = `<h1>Hello World!</h1>`;
  const mock = jest.spyOn(fs, "readFileSync");

  mock.mockImplementation(() => mockTemplate);

  const returnedTemplate = TemplateHelper.load(
    "fake/dir",
    "FakeController",
    "index"
  );
  expect(returnedTemplate).toEqual(mockTemplate);
  expect(fs.readFileSync).toHaveBeenCalled();

  TemplateHelper.load("fake/dir", "FakeController", "index");

  expect(fs.readFileSync).toHaveBeenCalledTimes(1);
});
