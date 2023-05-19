import type { FC } from 'react'

import { Form, Link } from '@remix-run/react'

import type { AuthUser } from '~/services/auth.server'

type Props = {
  user?: AuthUser | null
}

export const Auth: FC<Props> = ({ user }) => {
  if (!user) {
    return (
      <Form method='post' action='/auth/twitch'>
        <button className=''>Login with Twitch</button>
      </Form>
    )
  }

  return (
    <div>
      <h2>Logged in as {user.displayName}</h2>
      <p>
        You can remove the link to this application at{' '}
        <Link to={'https://www.twitch.tv/settings/connections'}>
          https://www.twitch.tv/settings/connections
        </Link>
      </p>

      <Form replace method='post' action='/auth/logout'>
        <button className=''>Logout</button>
      </Form>
    </div>
  )
}
