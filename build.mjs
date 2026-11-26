import { cp, mkdir, rm } from 'node:fs/promises';

const root = new URL('.', import.meta.url);
const dist = new URL('./dist/', root);
await rm(dist, { recursive: true, force: true });
await mkdir(new URL('./dist/assets/', root), { recursive: true });
await cp(new URL('./src/index.html', root), new URL('./dist/index.html', root));
await cp(new URL('./src/styles.css', root), new URL('./dist/styles.css', root));
await cp(new URL('./src/app.js', root), new URL('./dist/app.js', root));
await cp(new URL('./src/data.js', root), new URL('./dist/data.js', root));
await cp(new URL('./src/assets/prateleira-logo.png', root), new URL('./dist/assets/prateleira-logo.png', root));
console.log('Build estático concluído.');
