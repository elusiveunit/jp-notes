const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
  extends: 'airbnb-base',
  parser: 'babel-eslint',
  env: {
    browser: true,
  },
  rules: {
    // Adjustments
    'arrow-parens': [ERROR, 'always'],
    'max-len': [
      WARNING,
      {
        code: 80,
        ignoreComments: false,
        ignoreTrailingComments: false,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    'prefer-destructuring': [
      ERROR,
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: false,
          object: true,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'operator-linebreak': [
      ERROR,
      'after',
      { overrides: { '?': 'before', ':': 'before' } },
    ],

    // Add
    'multiline-ternary': ['error', 'always-multiline'],

    // Disable
    'class-methods-use-this': OFF,
    'implicit-arrow-linebreak': OFF,
    'import/prefer-default-export': OFF,
  },
};
