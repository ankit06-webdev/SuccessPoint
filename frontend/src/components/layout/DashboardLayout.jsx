import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import DashboardHeader from './DashboardHeader'
import MobileBottomNav from './MobileBottomNav'

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className='flex h-screen overflow-hidden md:bg-primary/15 relative'>
      
      <div className="hidden md:block w-72 flex-shrink-0"></div>
      
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex flex-col min-w-0 flex-1 h-full">
          <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />
          
          {/* Added pb-20 md:pb-0 to prevent content from hiding behind the mobile bottom nav */}
          <main className="custom-scrollbar min-h-0 flex-1 overflow-y-auto bg-white pb-20 md:pb-0">
            <Outlet />
          </main>
      </div>

      {/* Render the mobile bottom navigation bar */}
      <MobileBottomNav />
    </div>
  )
}

export default DashboardLayout