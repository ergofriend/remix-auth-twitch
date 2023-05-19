import type { FC } from 'react'

import { Form } from '@remix-run/react'

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
      <p>Logged in as {user.displayName}</p>

      <Form replace method='post' action='/auth/logout'>
        <button className=''>Logout</button>
      </Form>
    </div>
  )
}
