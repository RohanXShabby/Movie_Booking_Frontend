import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../UI/Navbar'
import Footer from '../UI/Footer'
import { useNavigation } from 'react-router-dom'
import { BeatLoader } from 'react-spinners'

const HomeLayout = () => {
    const navigate = useNavigation()
    return (
        <>
            <div className='min-h-screen flex flex-col justify-between text-dark-text bg-dark-primary '>
                <Navbar />
                {navigate.state === "loading" ? <BeatLoader /> : <Outlet />}
                <Footer />
            </div>
        </>
    )
}

export default HomeLayout
