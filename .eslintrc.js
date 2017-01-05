const eslintrc = {
  extends: ['eslint-config-airbnb'],
  env: {
    browser: true,
    node: true,
    mocha: true,
    jest: true,
    es6: true,
  },
  globals: {
    '$': true
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
    },
  },
  plugins: [
    'react',
    'babel'
  ],
  rules: {
    'class-methods-use-this': 0,
    "no-unused-expressions": [2, {"allowShortCircuit": true, "allowTernary": true}],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'import/no-extraneous-dependencies': 0,
    'no-extraneous-dependencies': 0,
    'linebreak-style': 0,
    'no-plusplus': 0,
    'prefer-template': 0,
    'max-len': 0,
    'import/extensions': 0
  }
};

module.exports = eslintrc;