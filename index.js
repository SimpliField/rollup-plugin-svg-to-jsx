const svgToJsx = require('svg-to-jsx');
const MagicString = require('magic-string');
const { createFilter } = require('rollup-pluginutils');
const { basename } = require('path');
const { readFileSync } = require('fs');

module.exports = function svgToJsx(options = {}) {
  const filter = createFilter(options.include || '**/*.svg', options.exclude);

  return {
    transform: (code, id) => {
      if (!filter(id)) return null;

      const name = toName(id);
      const content = readFileSync(id, 'utf-8').toString();

      return new Promise((res, rej) => {
        res(content);
      }).then((jsx) => {
        const result = toExport(jsx, name);

        console.log(result);

        return {
          code: result,
        };
      })
    }
  }
}

function toExport(jsx, name = 'Icon') {
  return `
import { h, FunctionalComponent } from '@stencil/core;

export ${name}:FunctionalComponent () => ${jsx}
`;
}

function toName(id) {
  const base = basename(id, '.svg');
  const name = base.split('-').filter(s => isNaN(s)).join('');

  return capitalize(name);
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
