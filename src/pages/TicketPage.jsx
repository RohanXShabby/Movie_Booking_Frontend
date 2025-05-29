import { useAuth } from "../context/AuthContext";
import LoginPage from "./LoginPage";

const TicketPage = () => {
    const { isLoggedIn, user } = useAuth();

    return isLoggedIn ? (
        <div>
            <h1 className="text-3xl font-semibold text-center mt-10">Welcome <span className="text-dark-accent">{user.name}</span></h1>
            <div className="text-xl text-center mt-4">You Don't Have Any ticket yet</div>
        </div>
    ) : (
        <div className="flex flex-col items-center justify-center mt-20">
            <h1 className="text-4xl font-bold text-dark-accent mb-8">Log In To See Your Tickets</h1>
            <div className="w-1/2">
                <LoginPage />
            </div>
        </div>
    );
};

export default TicketPage;
