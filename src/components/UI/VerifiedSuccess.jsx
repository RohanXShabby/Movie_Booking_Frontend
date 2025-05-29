import { useNavigate } from 'react-router-dom'

const VerifiedSuccess = () => {

    const navigate = useNavigate()

    const handleLogIN = () => {
        navigate('/login')
    }
    return (
        <div className="flex flex-col items-center justify-center text-dark-text min-h-screen bg-dark-primary">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-green-500 mb-4">✔ Verified Successfully!</h1>
                <p className="text-lg">You have been successfully verified. Redirecting to the Log In </p>
            </div>
            <button onClick={handleLogIN} className="mt-6 px-6 py-2 bg-dark-accent text-white cursor-pointer font-semibold rounded hover:bg-blue-600 transition">
                Log In Now
            </button>
        </div>
    )
}

export default VerifiedSuccess
