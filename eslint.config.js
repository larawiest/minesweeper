import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import globals from 'globals';
import svelteParser from 'svelte-eslint-parser';
import tsEslint from 'typescript-eslint';

import stylistic from '@stylistic/eslint-plugin'

export default tsEslint.config(
	js.configs.recommended,
	...tsEslint.configs.recommendedTypeChecked,
	{
		// configure the ts parser for ts files
		files: ['**/*.ts'],
		languageOptions: {
			parser: tsEslint.parser,
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname
			}
		}
	},
	{
		files: ['*.js', '*.config.ts'],
		...tsEslint.configs.disableTypeChecked
	},
	...eslintPluginSvelte.configs['flat/recommended'],
	...eslintPluginSvelte.configs['flat/prettier'],
	{
		// dev tools and server logic run in node environments
		files: ['**/*.server.ts', '*.config.ts', '*.config.js'],
		languageOptions: {
			globals: {
				...globals.node
			}
		}
	},
	{
		files: ['**/*.{svelte,ts}'],
		rules: {
         eqeqeq: 'error',
         camelcase: 'warn'
      }
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			// mounted svelte components run in the browser
			globals: {
				...globals.browser
			},
			ecmaVersion: 2022,
			sourceType: 'module',
			// setup the svelte parser and give it the ts parser config
			parser: svelteParser,
			parserOptions: {
				parser: tsEslint.parser,
				// needed so ts parser won't skip svelte files
				extraFileExtensions: ['.svelte'],
				// svelte files need both `tsconfig`s
				//project: ['tsconfig.json', '.svelte-kit/tsconfig.json'],
				project: ['tsconfig.app.json'],
				tsconfigRootDir: import.meta.dirname
			}
		},
		rules: {
			//'no-unused-vars': 'error',
			'prefer-const': 'error',
			// ignore the $$Props types in shadcn-svelte
         '@typescript-eslint/restrict-template-expressions': 'never',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					varsIgnorePattern: '^\$\$(Props|Events|Slots|Generic)'
				}
			]
		}
	},
	{
		files: ['tests/**/*.ts'],
		rules: {
			'no-empty-pattern': [
				'error',
				{
					// I use `{}` when defining vitest fixtures
					allowObjectPatternsAsParameters: true
				}
			]
		}
	},
	{
		ignores: [
			'.svelte-kit',
			'.vercel',
			'.github',
			'.storybook',
			'.vscode',
			'build',
			'static',
			'package',
			'coverage',
			'node_modules'
		]
	},
	// this only disables rules; it goes last to win the cascade
	eslintConfigPrettier,
	// styles not conflicting with prettier
  {
  	 //files: ['**/*.{js,mjs,cjs,ts}']
  	 files: ['**/*.{js,mjs,cjs,ts,svelte}'],
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      '@stylistic/no-mixed-spaces-and-tabs': 'warn',
      '@stylistic/indent': ['warn', 'tab']
    }
  }
);
