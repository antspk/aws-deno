#!/usr/bin/env deno
import * as cdk from 'npm:aws-cdk-lib';
import { DenoAppStack } from '../lib/deno-app-stack.ts';
import { DenoRuntimeLayerStack } from '../deno-lambda/lib/deno-runtime-stack.ts';
import { dirname, fromFileUrl, join } from 'https://deno.land/std@0.167.0/path/mod.ts';

const app = new cdk.App();

const denoRuntimeStack = new DenoRuntimeLayerStack(app, 'DenoRuntimeLayerStack', {
  runtimePath: join(dirname(fromFileUrl(import.meta.url)), '../runtime'),
});

const appStack = new DenoAppStack(app, 'DenoCdkAppStack', {
  stackName: 'deno-cdk-app',
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */

  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },

  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});

appStack.addDependency(denoRuntimeStack, 'Deno Lambda Layer');
