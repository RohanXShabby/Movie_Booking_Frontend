import React from 'react'
import Navbar from '../components/UI/Navbar'
import Footer from '../components/UI/Footer'

const ErrorPage = () => {
    return (
        <div className='min-h-screen flex flex-col justify-between text-dark-text bg-dark-primary '>
            <Navbar />
            <div className='font-bold text-5xl flex items-center gap-4 justify-center'>
                <span className='text-dark-accent'>404</span> Page Not Found...!
            </div>
            <Footer />
        </div>
    )
}

export default ErrorPage
