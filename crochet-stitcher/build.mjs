import { exec } from 'child_process';
import { writeFile, rm } from 'fs/promises';
import { promisify } from 'util';

// Delete dist files
await rm('dist', { recursive: true, force: true });

// Build the TypeScript
for (const kind of ['cjs', 'esm', 'types']) {
    console.log(`Building ${kind}...`);
    await promisify(exec)(`tsc -b tsconfig.${kind}.json`);
}

// Write package.json for ESM build
await writeFile('dist/esm/package.json', JSON.stringify({ type: 'module' }));
