import path from 'path';
import glob from 'fast-glob';

import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import cleanup from 'rollup-plugin-cleanup';
import resolve from 'rollup-plugin-node-resolve';

const ENV = process.env.BABEL_ENV;

export default glob.sync('themes/jp-notes/assets/js/*.js').map((filePath) => {
  const outputFileName = path
    .basename(filePath)
    .replace(/\.js$/, ENV === 'production' ? '.min.js' : '.js');

  return {
    input: filePath,
    output: {
      file: `themes/jp-notes/static/js/${outputFileName}`,
      format: 'iife',
      sourcemap: true,
      indent: true,
    },
    plugins: [
      resolve(),
      babel({
        exclude: 'node_modules/**',
      }),
      filesize(),
      cleanup({
        comments: 'none',
      }),
    ],
  };
});
