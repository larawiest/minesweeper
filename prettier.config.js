/** @type {import("prettier").Config} */
const config = {
	endOfLine: 'lf',
	useTabs: true,
	semi: false,
	parser: 'typescript',
	singleQuote: true,
	//trailingComma: 'none',
   trailingComma: 'es5',
	quoteProps: 'preserve',
	bracketSpacing: true,
	bracketSameLine: true,
	plugins: [
		'prettier-plugin-svelte',
		'prettier-plugin-tailwindcss',
		'prettier-plugin-organize-imports'
	],
	// This tells prettier to handle svelte files separately
	overrides: [
		{
			files: '*.svelte',
			options: { parser: 'svelte' }
		}
	]
};
export default config;
