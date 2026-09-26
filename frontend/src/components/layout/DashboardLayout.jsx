import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import DashboardHeader from './DashboardHeader'

const DashboardLayout = () => {
  return (
    <>
      <div className='flex h-screen overflow-hidden bg-primary/15 relative'>
      <div className="left w-72 flex-shrink-0"><Sidebar /></div>
      <div className="flex flex-col min-w-0 flex-1 h-full  ">
          <DashboardHeader />
          <main className="custom-scrollbar min-h-0 flex-1 overflow-y-auto bg-white ">
            <Outlet />
          </main>
        </div>
      </div>

    </>

  )
}

export default DashboardLayout