const { cyan, green, red } = require('chalk');

const { log, error } = console;

module.exports = {
  success: i => log(green(i)),
  failure: i => error(red(i)),
  query: q => log(cyan(q)),
};
