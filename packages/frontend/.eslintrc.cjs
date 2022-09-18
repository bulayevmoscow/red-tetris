module.exports = {
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "./tsconfig.json"
    },
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier'
    ],
    plugins: ['react', '@typescript-eslint', 'prettier', 'prefer-arrow'],
    "ignorePatterns": ["dist", "node_modules", "examples", "scripts"],
    rules: {
        'prettier/prettier': ['error'],
        'react/display-name': 'off',
        'prefer-arrow/prefer-arrow-functions': [
            'warn',
            {
                'disallowPrototype': true,
                'singleReturnOnly': false,
                'classPropertiesAllowed': false
            }
        ]
    },
    settings: {
        'react': {
            'version': 'detect'
        }
    }
}