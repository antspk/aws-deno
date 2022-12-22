import { Stack, StackProps } from 'npm:aws-cdk-lib';
import { Construct } from 'npm:constructs';
import { DenoLambdaFunction } from '../deno-lambda/lib/deno-lambda.ts';

export class DenoAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambda = new DenoLambdaFunction(this, 'lambda');
  }
}
