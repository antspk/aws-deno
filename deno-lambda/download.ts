const DENO_VERSION = '1.29.1';

const response = await fetch(
  `https://github.com/denoland/deno/releases/download/v${DENO_VERSION}/deno-x86_64-unknown-linux-gnu.zip`
);

if (!response.body) {
  throw new Error('Deno runtime executable body to download!');
}

const outFile = await Deno.open('./runtime/bin/deno', { write: true, create: true });
await response.body.pipeTo(outFile.writable);
await outFile.close();