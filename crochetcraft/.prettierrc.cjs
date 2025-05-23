module.exports = {
    ...require('../.prettierrc.cjs'),
    plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],
    pluginSearchDirs: ['.'],
    overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }],
};
