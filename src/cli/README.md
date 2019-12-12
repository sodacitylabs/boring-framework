# The Boring CLI
This is the code for the Command Line Interface (CLI) that users interact with while scaffolding projects, creating controllers and models etc.

The code follows two design patterns: [Interpreter](https://www.oodesign.com/interpreter-pattern.html) for taking user input _expressions_, generating a _context_ object with that input mapped to an output [Command](https://www.oodesign.com/command-pattern.html) which executes on that context.
