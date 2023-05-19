import type {LoaderFunction} from '@remix-run/cloudflare'

import {authenticator} from '~/services/auth.server'

export let loader: LoaderFunction = async ({request}) => {
  return await authenticator.authenticate('twitch', request, {
    successRedirect: '/',
    failureRedirect: '/auth/failure',
  })
}
