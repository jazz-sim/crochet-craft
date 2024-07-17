module.exports = {
    ...require('../.prettierrc.cjs'),
    plugins: ['prettier-plugin-svelte'],
    pluginSearchDirs: ['.'],
    overrides: [{ files: '*.svelte', options: { parser: 'svelte' } }],
};
