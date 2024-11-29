import { execFile } from 'child_process';
import { writeFile, rm, mkdir } from 'fs/promises';
import { argv } from 'process';
import { promisify } from 'util';

// Delete dist files and write package.json for ESM build
await rm('dist', { recursive: true, force: true });
await mkdir('dist/esm', { recursive: true });
await writeFile('dist/esm/package.json', JSON.stringify({ type: 'module' }));

const args = argv;
args.splice(0, 2); // remove argv[0] and argv[1]

// Build the TypeScript
console.log('Running build...');
await Promise.all(
    ['cjs', 'esm', 'types'].map(async (kind) => {
        await promisify(execFile)('tsc', ['-b', `tsconfig.${kind}.json`, ...args], { shell: true });
    }),
);
console.log('Done!');
