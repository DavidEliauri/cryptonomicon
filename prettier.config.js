/* eslint-env node */
/** @type {import('@types/prettier').Config} */
module.exports = {
    semi: true,
    tabWidth: 4,
    singleQuote: true,
    printWidth: 100,
    singleAttributePerLine: true,
    trailingComma: 'es5',
    endOfLine: 'crlf',
    plugins: [require('prettier-plugin-tailwindcss')],
    tailwindConfig: './tailwind.config.js',
};
