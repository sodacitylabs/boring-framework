/**
 *
 * @param {*} args array-like command line inputs given by a user
 * @returns {Object} a Context object for getting the input and getting/setting the output
 */
module.exports = function InterpreterContext(args) {
  const _input = [...args.slice(2)];

  if (!_input.length) {
    throw new Error(
      `No arguments provided. Did you forget to include a command?`
    );
  }

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
};
