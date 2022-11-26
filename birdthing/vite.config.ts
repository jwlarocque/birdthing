import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],

	server: {
		proxy: {
			'/api': 'http://localhost:8000'
		}
	},
	
	define: {
        'process.env.ANCHOR_BROWSER': true
    },
};

export default config;
