import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/mod.ts';
import { Function, FunctionOptions, LayerVersion, Runtime, AssetCode, Code } from 'npm:aws-cdk-lib/aws-lambda';
import { Construct } from 'npm:constructs';

export class DenoLambdaFunction extends Function {
  constructor(scope: Construct, id: string, props: DenoFunctionProps) {
    // todo create a construct similar to NodejsLambdaFunction
    // https://github.com/aws/aws-cdk/blob/v1-main/packages/%40aws-cdk/aws-lambda-nodejs/lib/function.ts

    const handler = props.handler ?? 'handler';

    // const __dirname = dirname(fromFileUrl(import.meta.url));
    // code: Code.fromAsset(join(__dirname, 'lambda')),
    // handler: 'deno-fn.handler',

    // figure out how to deploy runtime layer only once per stack
    const runtimePath = fromFileUrl(join(dirname(import.meta.url), '../runtime'))

    const denoRuntimeLayer = new LayerVersion(this, 'DenoRuntime', {
      code: Code.fromAsset(runtimePath),
      license: 'Apache-2.0',
      description: 'A deno runtime layer',
    });

    super(scope, id, {
      ...props,
      runtime: Runtime.PROVIDED_AL2,
      layers: [denoRuntimeLayer],
    });
  }
}

export class DenoLambdaFunctionBundling {


  static bundle(options: BundlingProps): AssetCode {
    return Code.fromAsset();
  }


}

export interface BundlingProps {

}

export interface DenoFunctionProps extends FunctionOptions {
  /**
   * Path to the entry file (JavaScript or TypeScript).
   *
   * @default - Derived from the name of the defining file and the construct's id.
   * If the `NodejsFunction` is defined in `stack.ts` with `my-handler` as id
   * (`new NodejsFunction(this, 'my-handler')`), the construct will look at `stack.my-handler.ts`
   * and `stack.my-handler.js`.
   */
  readonly entry?: string;

  /**
   * The name of the exported handler in the entry file.
   *
   * @default handler
   */
  readonly handler?: string;

  /**
   * Whether to automatically reuse TCP connections when working with the AWS
   * SDK for JavaScript.
   *
   * This sets the `AWS_NODEJS_CONNECTION_REUSE_ENABLED` environment variable
   * to `1`.
   *
   * @see https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/node-reusing-connections.html
   *
   * @default true
   */
  readonly awsSdkConnectionReuse?: boolean;

  /**
   * The path to the dependencies lock file (`deno.lock`) or any custom lock file.
   *
   * This will be used as the source for the volume mounted in the Docker
   * container.
   *
   * @default - the path is found by walking up parent directories searching for
   *   a `deno.lock` or any custom lock file.
   */
  readonly depsLockFilePath?: string;

  /**
   * The path to the directory containing project config files (`package.json` or `tsconfig.json`)
   *
   * @default - the directory containing the `depsLockFilePath`
   */
  readonly projectRoot?: string;
}


// TODO: rewrite in deno
// /**
//  * Checks given lock file or searches for a lock file
//  */
// function findLockFile(depsLockFilePath?: string): string {
//   if (depsLockFilePath) {
//     if (!fs.existsSync(depsLockFilePath)) {
//       throw new Error(`Lock file at ${depsLockFilePath} doesn't exist`);
//     }

//     if (!fs.statSync(depsLockFilePath).isFile()) {
//       throw new Error('`depsLockFilePath` should point to a file');
//     }

//     return path.resolve(depsLockFilePath);
//   }

//   const lockFiles = findUpMultiple([
//     LockFile.PNPM,
//     LockFile.YARN,
//     LockFile.NPM,
//   ]);

//   if (lockFiles.length === 0) {
//     throw new Error('Cannot find a package lock file (`pnpm-lock.yaml`, `yarn.lock` or `package-lock.json`). Please specify it with `depsLockFilePath`.');
//   }
//   if (lockFiles.length > 1) {
//     throw new Error(`Multiple package lock files found: ${lockFiles.join(', ')}. Please specify the desired one with \`depsLockFilePath\`.`);
//   }

//   return lockFiles[0];
// }

// /**
//  * Searches for an entry file. Preference order is the following:
//  * 1. Given entry file
//  * 2. A .ts file named as the defining file with id as suffix (defining-file.id.ts)
//  * 3. A .js file name as the defining file with id as suffix (defining-file.id.js)
//  * 4. A .mjs file name as the defining file with id as suffix (defining-file.id.mjs)
//  */
// function findEntry(id: string, entry?: string): string {
//   if (entry) {
//     if (!/\.(jsx?|tsx?|mjs)$/.test(entry)) {
//       throw new Error('Only JavaScript or TypeScript entry files are supported.');
//     }
//     if (!fs.existsSync(entry)) {
//       throw new Error(`Cannot find entry file at ${entry}`);
//     }
//     return entry;
//   }

//   const definingFile = findDefiningFile();
//   const extname = path.extname(definingFile);

//   const tsHandlerFile = definingFile.replace(new RegExp(`${extname}$`), `.${id}.ts`);
//   if (fs.existsSync(tsHandlerFile)) {
//     return tsHandlerFile;
//   }

//   const jsHandlerFile = definingFile.replace(new RegExp(`${extname}$`), `.${id}.js`);
//   if (fs.existsSync(jsHandlerFile)) {
//     return jsHandlerFile;
//   }

//   const mjsHandlerFile = definingFile.replace(new RegExp(`${extname}$`), `.${id}.mjs`);
//   if (fs.existsSync(mjsHandlerFile)) {
//     return mjsHandlerFile;
//   }

//   throw new Error(`Cannot find handler file ${tsHandlerFile}, ${jsHandlerFile} or ${mjsHandlerFile}`);
// }

// /**
//  * Finds the name of the file where the `NodejsFunction` is defined
//  */
// function findDefiningFile(): string {
//   let definingIndex;
//   const sites = callsites();
//   for (const [index, site] of sites.entries()) {
//     if (site.getFunctionName() === 'NodejsFunction') {
//       // The next site is the site where the NodejsFunction was created
//       definingIndex = index + 1;
//       break;
//     }
//   }

//   if (!definingIndex || !sites[definingIndex]) {
//     throw new Error('Cannot find defining file.');
//   }

//   return sites[definingIndex].getFileName();
// }