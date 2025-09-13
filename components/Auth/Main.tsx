import React from 'react'
import Signup from './Signup'
import Sidebar from './sidebar'

type Props = {}

const Main = (props: Props) => {
  return (
    <div className='w-full min-h-screen flex items-center justify-center gap-[100px] p-[50px] py-[80px]'>
        <div className='w-1/2 flex justify-center'>
          <Signup />
        </div>
        <div className='w-1/2 flex justify-center'>
          <Sidebar />
        </div>
    </div>
  )
}

export default Main