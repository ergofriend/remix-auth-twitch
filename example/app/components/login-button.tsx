import { Form } from '@remix-run/react'

export const LoginButton = () => {
  return (
    <Form method='post' action='/auth/twitch'>
      <button
        type='submit'
        className='text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2'
      >
        Login with Twitch
      </button>
    </Form>
  )
}
