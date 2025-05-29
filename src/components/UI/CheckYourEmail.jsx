const CheckYourEmail = () => {
    const handleClick = () => {
        window.open('https://mail.google.com');
    };
    return (
        <div className=' bg-dark-primary w-screen h-screen flex items-center justify-center ' >
            <div className="text-center flex flex-col gap-8 text-dark-text w-150 ">
                <h2 className="text-2xl bg-dark-accent text-dark-secondary rounded-lg py-2 font-extrabold">Check Your Email</h2>
                <p className="text-base mt-4">
                    Please check your email for verification. If you don't see the email, check your spam folder or try to Register again.
                </p>
                <button
                    onClick={handleClick}
                    className="px-4 py-2 cursor-pointer bg-dark-accent text-dark-text font-semibold rounded-lg hover:bg-dark-accent hover:-translate-y-0.5 shadow-dark-accent hover:drop-shadow-xl hover:text-dark-primary duration-150 transition"
                >
                    Open Gmail Inbox
                </button>
            </div>
        </div>
    )
}

export default CheckYourEmail
