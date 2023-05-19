import { FC, ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const Layout: FC<Props> = ({ children }) => {
  return (
    <div className='flex flex-col justify-center items-center gap-10 h-full'>
      {children}
    </div>
  )
}
