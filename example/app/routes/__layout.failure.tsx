import { Layout } from '~/components/layout'
import { LoginButton } from '~/components/login-button'

export default function LoginFailure() {
  return (
    <Layout>
      <h2 className='text-red-400 text-2xl'>Login Failure</h2>
      <p className='text-blue-400'>Login failed. Please try again.</p>
      <LoginButton />
    </Layout>
  )
}
