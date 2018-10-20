import path from 'path';
import glob from 'fast-glob';

import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import resolve from 'rollup-plugin-node-resolve';

export default glob.sync('themes/jp-notes/assets/js/*.js').map((filePath) => ({
  input: filePath,
  output: {
    file: `themes/jp-notes/static/js/${path.basename(filePath)}`,
    format: 'iife',
    sourcemap: true,
    indent: true,
    // Shortcuts and micro minification boost for commonly used things
    /* intro: `
      var win = window;
      var doc = document;
      var $ = doc.querySelectorAll;
    `, */
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
    filesize(),
  ],
}));
