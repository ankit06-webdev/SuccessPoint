import React from 'react'
import Navbar from '@/pages/public/Navbar'
import { Outlet } from 'react-router-dom'

const PublicLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-muted ">
                <Navbar />

                <main className="public-content ">
                    <Outlet />
                </main>
        </div>

    )
}

export default PublicLayout