import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";

import { initAuth } from './app/services/auth.server';

const handleRequest = createPagesFunctionHandler({
  build,
  getLoadContext: (context) => context.env,
  mode: process.env.NODE_ENV,
})

export function onRequest(context: EventContext<Env, string, unknown>) {
  initAuth(context.env)
  return handleRequest(context)
}
