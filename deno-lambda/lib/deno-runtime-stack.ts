import { Stack, StackProps } from 'npm:aws-cdk-lib';
import { Construct } from 'npm:constructs';
import { Code, LayerVersion } from 'npm:aws-cdk-lib/aws-lambda';
import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/mod.ts';

export class DenoRuntimeLayerStack extends Stack {
  readonly denoRuntimeLayer: LayerVersion;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const runtimePath = fromFileUrl(join(dirname(import.meta.url), '../runtime'))

    this.denoRuntimeLayer = new LayerVersion(this, 'DenoRuntime', {
      code: Code.fromAsset(runtimePath),
      license: 'Apache-2.0',
      description: 'A deno runtime layer',
    });
  }
}
