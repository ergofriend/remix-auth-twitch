import { Form } from '@remix-run/react'

export default function LoginFailure() {
  return (
    <div>
      <h1>Login Failure</h1>
      <p>
        Login failed. Please try again.
        <Form replace method='post' action='/auth/twitch'>
          <button className='btn btn-outline btn-success'>Login</button>
        </Form>
      </p>
    </div>
  )
}
