module.exports = {
  'parserOptions': {
    'sourceType': 'module',
    ecmaVersion: 2022
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    "@typescript-eslint/no-namespace": "off"
  }
};