import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'https://deno.land/x/lambda/mod.ts';
import { dep } from './dep.ts';

export async function handler(
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2> {
  console.log(dep);

  return {
    body: `Welcome to deno ${Deno.version.deno} 🦕`,
    headers: { 'content-type': 'text/html;charset=utf8' },
    statusCode: 200,
  };
}
