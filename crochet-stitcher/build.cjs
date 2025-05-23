const { fork } = require('child_process');
const { writeFile, rm, mkdir } = require('fs/promises');
const { argv } = require('process');

// This entire file is written in CommonJS instead of ESM so that we can use
// require.resolve. Although ESM has an equivalent (import.meta.resolve), that
// function was stabilized in Node v18.19.0 [1], and Cloudflare Pages uses
// v18.17.1.
//
// [1]: https://nodejs.org/api/esm.html#importmetaresolvespecifier
const TSC = require.resolve('typescript/bin/tsc');

async function main() {
    console.log(`TypeScript compiler is ${TSC}`);

    // Delete dist files and write package.json for ESM build
    await rm('dist', { recursive: true, force: true });
    await mkdir('dist/esm', { recursive: true });
    await writeFile('dist/esm/package.json', JSON.stringify({ type: 'module' }));

    const args = argv;
    args.splice(0, 2); // remove argv[0] and argv[1]

    // Build the TypeScript
    console.log('Running TypeScript compiler...');
    await Promise.all(
        ['cjs', 'esm', 'types'].map(
            (kind) =>
                new Promise((resolve, reject) => {
                    const child = fork(TSC, ['-b', `tsconfig.${kind}.json`, ...args], {
                        stdio: 'inherit',
                    });
                    child.on('exit', (code, signal) => {
                        if (code === 0) {
                            resolve();
                        } else if (code !== null) {
                            reject(`compiling ${kind} failed, exit code ${code}`);
                        } else {
                            reject(`compiling ${kind} failed, signal ${signal}`);
                        }
                    });
                }),
        ),
    );
    console.log('Done!');
}

main();
