const ServerCommand = require("./commands/ServerCommand");

/**
 *
 * @param {*} args array-like command line inputs given by a user
 * @returns {Object} a Context object for getting the input and getting/setting the output
 */
function InterpreterContext(args) {
  const _input = [...args.slice(2)];

  return {
    getInput: function() {
      return [..._input];
    },
    getOutput: () => {
      return this.output;
    },
    setOutput: val => {
      this.output = val;
    }
  };
}

class InterpreterExpression {
  interpret(context /* eslint-disable-line no-unused-vars */) {
    throw new Error("Not Implemented");
  }

  commandValue() {
    throw new Error("Not Implemented");
  }
}

class ServerExpression extends InterpreterExpression {
  interpret(context) {
    const inputs = context.getInput();

    if (inputs[0].trim() === "server") {
      context.setOutput(new ServerCommand());
    }
  }
}

exports.InterpreterContext = InterpreterContext;
exports.ServerExpression = ServerExpression;
