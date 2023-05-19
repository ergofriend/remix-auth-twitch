import { NavLink, Outlet } from '@remix-run/react'

export default function Page() {
  return (
    <div className='grid grid-rows-[auto_1fr] min-h-full p-4'>
      <div className='flex gap-4'>
        <NavLink
          to='/'
          className='text-blue-200 underline [&.active]:text-blue-400'
        >
          Home
        </NavLink>
        <NavLink
          to='/login'
          className='text-blue-200 underline [&.active]:text-blue-400'
        >
          Login
        </NavLink>
        <NavLink
          to='/failure'
          className='text-blue-200 underline [&.active]:text-blue-400'
        >
          Failure
        </NavLink>
        <NavLink
          to='/secret'
          className='text-blue-200 underline [&.active]:text-blue-400'
        >
          Secret
        </NavLink>
      </div>
      <Outlet />
    </div>
  )
}
