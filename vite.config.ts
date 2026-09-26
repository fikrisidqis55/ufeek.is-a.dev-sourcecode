import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	envPrefix: ['VITE_', 'PUBLIC_', 'NEXT_PUBLIC_'],
	ssr: {
		noExternal: ['three']
	}
});
