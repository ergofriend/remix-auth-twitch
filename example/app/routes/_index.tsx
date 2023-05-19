import type { LoaderFunction, V2_MetaFunction } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import { Auth } from '~/components/auth'
import { authenticator } from '~/services/auth.server'

export const meta: V2_MetaFunction = () => {
  return [{ title: 'New Remix App' }]
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request)
  if (!user) return { user: null }
  return { user }
}

export default function Index() {
  const data = useLoaderData<typeof loader>()

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>Welcome to Remix</h1>
      <Auth user={data.user} />
    </div>
  )
}
