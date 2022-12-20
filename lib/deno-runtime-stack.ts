import { Stack, StackProps } from 'npm:aws-cdk-lib';
import { Construct } from 'npm:constructs';
import { Code, LayerVersion } from 'npm:aws-cdk-lib/aws-lambda';

export class DenoRuntimeLayerStack extends Stack {
  readonly denoRuntimeLayer: LayerVersion;

  constructor(scope: Construct, id: string, props: DenoRuntimeLayerProps) {
    super(scope, id, props);

    this.denoRuntimeLayer = new LayerVersion(this, 'DenoRuntime', {
      code: Code.fromAsset(props.runtimePath),
      license: 'Apache-2.0',
      description: 'A deno runtime layer',
    });
  }
}

export interface DenoRuntimeLayerProps extends StackProps {
  readonly runtimePath: string;
}
