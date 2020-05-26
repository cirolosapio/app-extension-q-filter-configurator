module.exports = {
  // https://eslint.org/docs/user-guide/configuring#configuration-cascading-and-hierarchy
  // This option interrupts the configuration hierarchy at this file
  // Remove this if you have an higher level ESLint config file (it usually happens into a monorepos)
  root: true,

  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module' // Allows for the use of imports
  },

  env: {
    browser: true
  },

  // Rules order is important, please avoid shuffling them
  extends: [
    // Base ESLint recommended rules
    // 'eslint:recommended',

    // Uncomment any of the lines below to choose desired strictness,
    // but leave only one uncommented!
    // See https://eslint.vuejs.org/rules/#available-rules
    'plugin:vue/essential', // Priority A: Essential (Error Prevention)
    // 'plugin:vue/strongly-recommended' // Priority B: Strongly Recommended (Improving Readability)
    // 'plugin:vue/recommended' // Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)

    'standard',


    'plugin:quasar/standard'
  ],

  // required to lint *.vue files
  plugins: [
    // https://eslint.vuejs.org/user-guide/#why-doesn-t-it-work-on-vue-file
    // required to lint *.vue files
    'vue',
    'quasar'
  ],

  globals: {
    'ga': true, // Google Analytics
    'cordova': true,
    '__statics': true,
    'process': true,
    'Capacitor': true,
    'chrome': true
  },

  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow paren-less arrow functions
    'arrow-parens': 'off',
    'one-var': 'off',

    'import/first': 'off',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'prefer-promise-reject-errors': 'off',
    'camelcase': 0,

    'quasar/no-invalid-props': 'error',
    'quasar/no-invalid-qfield-usage': 'error',

    'comma-dangle': ['error', 'never'],
    // 'camelcase': ['error', { 'properties': 'never', ignoreDestructuring: true }],
    'eqeqeq': ['error', 'smart'],

    'vue/attribute-hyphenation': 'error',
    'vue/html-closing-bracket-spacing': ['error', {
      'startTag': 'never',
      'endTag': 'never',
      'selfClosingTag': 'always'
    }],
    // 'vue/html-indent': ['error', 2, {
    //   'attribute': 1,
    //   'baseIndent': 1,
    //   'closeBracket': 0,
    //   'alignAttributesVertically': false,
    //   'ignores': []
    // }],
    'vue/html-self-closing': ['error', {
      'html': {
        'void': 'always',
        'normal': 'always',
        'component': 'always'
      },
      'svg': 'always',
      'math': 'always'
    }],
    'vue/component-name-in-template-casing': ['error', 'kebab-case', {
      'registeredComponentsOnly': true,
      'ignores': []
    }],
    'vue/html-quotes': ['error', 'double', { 'avoidEscape': false }],
    'vue/mustache-interpolation-spacing': ['error', 'always'],
    'vue/name-property-casing': 'error',
    'vue/no-multi-spaces': 'error',
    'vue/no-spaces-around-equal-signs-in-attribute': 'error',
    'vue/v-bind-style': ['error', 'shorthand'],
    'vue/v-on-style': ['error', 'shorthand'],
    'vue/attributes-order': ['error', {
      'order': [
        'DEFINITION',
        'OTHER_ATTR',
        'LIST_RENDERING',
        'CONDITIONALS',
        'RENDER_MODIFIERS',
        'GLOBAL',
        'UNIQUE',
        'TWO_WAY_BINDING',
        'OTHER_DIRECTIVES',
        'EVENTS',
        'CONTENT'
      ],
      'alphabetical': false
    }],
    'vue/order-in-components': ['error', {
      'order': [
        'el',
        'name',
        'parent',
        'functional',
        ['delimiters', 'comments'],
        'extends',
        'mixins',
        'inheritAttrs',
        'model',
        ['props', 'propsData'],
        ['components', 'directives', 'filters'],
        'fetch',
        'asyncData',
        'data',
        'LIFECYCLE_HOOKS',
        'computed',
        'watch',
        'methods',
        'head',
        ['template', 'render'],
        'renderError'
      ]
    }],
    'vue/match-component-file-name': ['error', {
      'extensions': ['vue'],
      'shouldMatchCase': true
    }],
    'vue/v-slot-style': 'error',
    'vue/eqeqeq': ['error', 'smart'],
    'vue/object-curly-spacing': ['error', 'always'],
    'vue/this-in-template': 'error',
    'vue/array-bracket-spacing': 'error',
    'vue/arrow-spacing': 'error',
    'vue/key-spacing': 'error',
    'vue/no-boolean-default': 'error',
    'vue/no-deprecated-scope-attribute': 'error',
    'vue/no-deprecated-slot-attribute': 'error',
    'vue/no-deprecated-slot-scope-attribute': 'error',
    'vue/no-empty-pattern': 'error',
    'vue/padding-line-between-blocks': 'error',
    'vue/require-name-property': 'error',
    'vue/space-infix-ops': 'error',
    'vue/space-unary-ops': 'error',
    'vue/valid-v-slot': 'error',

    // 'vue/component-definition-name-casing': ['error', 'kebab-case'], va in conflitto
    // 'vue/camelcase': ['error', { properties: 'never', ignoreDestructuring: true }], vengono usate variabili non in camelCase
    // 'vue/brace-style':  ['error', '1tbs', { 'allowSingleLine': false }], funziona già?
    // 'vue/no-template-shadow': 'error', importante ma non applicabile
    // 'vue/static-class-names-order': 'error',
    // 'vue/prop-name-casing': 'error',
    // vue/require-default-prop non so
    // vue/require-prop-types non so
    // vue/v-on-function-call non so

    // allow console.log during development only
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
