import { LoaderFunction, redirect } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'

import { Card } from '~/components/card'
import { Layout } from '~/components/layout'
import { authenticator } from '~/services/auth.server'

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request)
  if (!user) return redirect('/login')
  return { user }
}

export default function Page() {
  const { user } = useLoaderData<typeof loader>()

  return (
    <Layout>
      <Card user={user} />
    </Layout>
  )
}
