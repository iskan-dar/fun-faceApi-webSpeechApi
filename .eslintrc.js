module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'func-names': 'off',
    'no-unused-vars': 'warn',
    'class-methods-use-this': 'off',
    'max-len': ['error', { code: 80 }],
    'no-console': 'warn',
    'no-return-assign': 'off',
  },
};
