// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier/flat');

module.exports = defineConfig([
  expoConfig,
  prettierConfig,
	{
  		files: ['src/hooks/use-color-scheme.web.ts'],
  		rules: {
			'react-hooks/set-state-in-effect': 'off',
			},
	},

	{
		ignores: ['dist/*'],
	},
]);
