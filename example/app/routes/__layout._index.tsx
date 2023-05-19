import type { V2_MetaFunction } from '@remix-run/cloudflare'
import { Link } from '@remix-run/react'

import { Layout } from '~/components/layout'

export const meta: V2_MetaFunction = () => {
  return [{ title: 'Remix Auth Twitch Demo' }]
}

export default function Page() {
  return (
    <Layout>
      <h1 className='text-blue-400 text-4xl'>Remix Auth Twitch Demo</h1>

      <ul className='max-w-md space-y-1 text-blue-200 list-disc list-inside'>
        <li>
          <Link
            className='text-blue-200 underline'
            to='https://github.com/sergiodxa/remix-auth'
          >
            sergiodxa/remix-auth: Simple Authentication for Remix
          </Link>
        </li>
        <li>
          <Link
            className='text-blue-200 underline'
            to='https://github.com/ergofriend/remix-auth-twitch'
          >
            ergofriend/remix-auth-twitch: Remix Auth Plugin for Twitch
          </Link>
        </li>
      </ul>

      <p className='text-blue-300'>
        You can remove the link to this application at{' '}
        <Link
          className='text-blue-200 underline'
          to={'https://www.twitch.tv/settings/connections'}
        >
          https://www.twitch.tv/settings/connections
        </Link>
      </p>
    </Layout>
  )
}
