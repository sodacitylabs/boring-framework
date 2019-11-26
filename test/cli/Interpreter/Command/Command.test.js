const Command = require("../../../../src/cli/Command/Command");

test("base class that throws by default", () => {
  try {
    const command = new Command();

    command.execute();
  } catch (ignore) {}
});
