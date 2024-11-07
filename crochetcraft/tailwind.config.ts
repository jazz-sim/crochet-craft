import { join } from 'path';
import type { Config } from 'tailwindcss';
import { skeleton } from '@skeletonlabs/tw-plugin';

const config = {
    darkMode: 'selector',
    content: [
        './src/**/*.{html,js,svelte,ts}',
        // 3. Append the path to the Skeleton package
        join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}'),
    ],
    theme: {
        extend: {},
    },
    plugins: [
        skeleton({
            themes: { preset: ['rocket'] },
        }),
    ],
} satisfies Config;

export default config;
