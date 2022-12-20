import { Stack, StackProps } from 'npm:aws-cdk-lib';
import { Construct } from 'npm:constructs';
import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/mod.ts';
import { Function, Runtime, Code, ILayerVersion } from 'npm:aws-cdk-lib/aws-lambda';

const __dirname = dirname(fromFileUrl(import.meta.url));

export class DenoAppStack extends Stack {
  constructor(scope: Construct, id: string, props: DenoAppStackProps) {
    super(scope, id, props);

    const lambda = new Function(this, 'deno-fn', {
      runtime: Runtime.PROVIDED_AL2,
      code: Code.fromAsset(join(__dirname, "lambda")),
      handler: 'deno-fn.handler',
      layers: [props.denoRuntimeLayer],
    })
  }
}

export interface DenoAppStackProps extends StackProps {
  readonly denoRuntimeLayer: ILayerVersion;
}