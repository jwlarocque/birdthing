import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import { preprocessMeltUI, sequence } from '@melt-ui/pp'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: sequence([
		preprocess(),
		preprocessMeltUI(),
	]),

	kit: {
		adapter: adapter()
	}
};

export default config;
