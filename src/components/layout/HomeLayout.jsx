import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../UI/Navbar'
import Footer from '../UI/Footer'

const HomeLayout = () => {
    return (
        <>
            <div className='min-h-screen flex flex-col justify-between text-dark-text bg-dark-primary '>
                <Navbar />
                <Outlet />
                <Footer />
            </div>
        </>
    )
}

export default HomeLayout
