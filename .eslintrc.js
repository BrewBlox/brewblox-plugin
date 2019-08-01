module.exports = {
  'root': true,
  'env': {
    'node': true,
  },
  'parser': 'vue-eslint-parser',
  'parserOptions': {
    'parser': 'babel-eslint',
    'sourceType': 'module',
    'ecmaVersion': 2018,
  },
  'extends': [
    'plugin:vue/recommended',
  ],
  'plugins': [
    'simple-import-sort',
  ],
  'rules': {
    'quotes': [
      'error',
      'single',
      {
        'avoidEscape': true,
      },
    ],
    'vue/max-attributes-per-line': 0,
    'vue/html-self-closing': 0,
    'comma-dangle': [
      'error',
      'always-multiline',
    ],
    'semi': 'error',
    'max-len': [
      1,
      120,
      2,
      {
        'ignoreUrls': true,
        'ignoreComments': false,
      },
    ],
  },
};
