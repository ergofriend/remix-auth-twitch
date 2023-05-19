import type { ActionFunction } from '@remix-run/cloudflare'

import { authenticator } from '~/services/auth.server'

export let action: ActionFunction = async ({ request }) => {
  return await authenticator.logout(request, { redirectTo: '/' })
}
