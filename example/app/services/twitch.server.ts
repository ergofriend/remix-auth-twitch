import {TwitchStrategy} from 'remix-auth-twitch'

import type {AuthUser} from './auth.server'
import {authenticator} from './auth.server'

let twitchStrategy: TwitchStrategy<AuthUser> | null = null

type TwitchStrategyOptions = {
  clientId: string
  clientSecret: string
  callbackURL: string
}

export const initTwitchStrategy = ({clientId, clientSecret, callbackURL }: TwitchStrategyOptions) => {
  if (twitchStrategy) return authenticator

  twitchStrategy = new TwitchStrategy<AuthUser>(
    {
      clientId,
      clientSecret,
      callbackURL,
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
