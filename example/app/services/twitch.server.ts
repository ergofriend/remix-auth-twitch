import {TwitchStrategy} from 'remix-auth-twitch'

import type {AuthUser} from './auth.server'
import {authenticator} from './auth.server'

let twitchStrategy: TwitchStrategy<AuthUser> | null = null

export const initTwitchStrategy = ({clientID, clientSecret}: {clientID: string; clientSecret: string}) => {
  if (twitchStrategy) return authenticator

  twitchStrategy = new TwitchStrategy<AuthUser>(
    {
      clientId: clientID,
      clientSecret,
      callbackURL: 'http://localhost:3000/auth/twitch/callback',
      includeEmail: true,
    },
    async ({profile}) => {
      return {
        username: profile.login,
        displayName: profile.display_name,
        thumbnail: profile.profile_image_url,
      }
    }
  )
  authenticator.use(twitchStrategy)
  return authenticator
}
