// noinspection TsLint
const CoffeeScript = require('coffeescript/lib/coffeescript/coffeescript');
const compile = CoffeeScript.compile;

CoffeeScript.eval = (code: string, options: any) => {
  if (options.bare == null) {
    options.bare = true;
  }
  // noinspection TsLint
  return eval(compile(code, options));
};

export default CoffeeScript;
