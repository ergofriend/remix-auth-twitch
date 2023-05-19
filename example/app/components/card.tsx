import { Form } from '@remix-run/react'
import { FC } from 'react'
import { AuthUser } from '~/services/auth.server'

type Props = {
  user: AuthUser
}

export const Card: FC<Props> = ({ user }) => {
  return (
    <div className='w-full max-w-sm bg-gray-700 border border-blue-100 rounded-lg shadow '>
      <div className='flex flex-col items-center p-5 gap-2'>
        <img
          width={80}
          height={80}
          className='mb-3 rounded-full shadow-lg'
          src={user.thumbnail}
          alt={user.displayName}
        />
        <h5 className='mb-1 text-xl font-medium text-blue-200'>
          {user.displayName}
        </h5>
        <span className='text-sm text-blue-300 '>{user.username}</span>
        <Form replace method='post' action='/auth/logout' className='pt-2'>
          <button className='relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-blue-500 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800'>
            <span className='relative px-5 py-2.5 transition-all ease-in duration-75 bg-slate-800  rounded-md group-hover:bg-opacity-0'>
              Logout
            </span>
          </button>
        </Form>
      </div>
    </div>
  )
}
