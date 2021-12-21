module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  plugins: [
    'prettier',
    '@typescript-eslint',
    'react',
    'jest',
  ],
  env: {
    browser: true,
    es6: true,
    "jest/globals": true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'airbnb-base',
    'airbnb-typescript/base',
    'prettier',
    'plugin:jest/recommended',
    'plugin:jest/style',
  ],
  rules: {
    'no-fallthrough': 'warn',
    'no-template-curly-in-string': 'warn',
    'no-undef': 'error',
    'no-useless-escape': 'warn',
    'no-useless-return': 'warn',
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'no-await-in-loop': 'off',
    'prefer-destructuring': 'error',
    'prefer-promise-reject-errors': 'warn',
    'no-buffer-constructor': 'warn',
    'no-restricted-globals': 'warn',
    'no-restricted-syntax': 'off',
    'no-useless-constructor': 'off',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'es5',
        arrowParens: 'avoid',
      },
    ],
    'prefer-object-spread': 'warn',
    'no-useless-catch': 'warn',
    'no-continue': 'off',
    'no-console': 'off',
    'no-plusplus': 'off',
    'no-constant-condition': ['error', { checkLoops: false }],
    'no-unused-vars': ['error', { args: 'none' }],
    '@typescript-eslint/no-unused-vars': 'off',
    'import/no-cycle': 'off',
    'import/no-useless-path-segments': 'warn',
    'import/order': 'warn',
    'import/first': 'warn',
    'import/newline-after-import': 'warn',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'error',
    'import/extensions': 'off',
    'class-methods-use-this': 'off',
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      }
    }
  }
};
