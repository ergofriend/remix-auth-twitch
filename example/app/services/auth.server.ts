import {Authenticator} from 'remix-auth'
import invariant from 'tiny-invariant'

import {sessionStorage} from '~/services/session.server'

import {initTwitchStrategy} from './twitch.server'

export type AuthUser = {
  username: string
  displayName: string
  thumbnail: string
}

export const authenticator = new Authenticator<AuthUser>(sessionStorage)

export const initAuth = (env: Env) => {
  const {
    TWITCH_API_CLIENT,
    TWITCH_API_SECRET,
  } = env

  invariant(TWITCH_API_CLIENT, 'TWITCH_API_CLIENT must be provided')
  invariant(TWITCH_API_SECRET, 'TWITCH_API_SECRET must be provided')
  initTwitchStrategy({
    clientID: TWITCH_API_CLIENT,
    clientSecret: TWITCH_API_SECRET,
  })
}
