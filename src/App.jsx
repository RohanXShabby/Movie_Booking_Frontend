import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomeLayout from "./components/layout/HomeLayout.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import AccountPage from "./pages/AccountPage.jsx";
import MoviesPage from "./pages/MoviesPage.jsx";
import TicketPage from "./pages/TicketPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import CheckYourEmail from "./components/UI/CheckYourEmail.jsx";
import VerifiedSuccess from "./components/UI/VerifiedSuccess.jsx";
import EmailforOTP from "./pages/EmailforOTP.jsx";
import EnterOTP from "./pages/EnterOTP.jsx";
import PasswordReset from "./pages/PasswordReset.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import MoviesBookingPage from "./pages/MoviesBookingPage.jsx";
import TicketBookingPage from "./pages/TicketBookingPage.jsx";
import SelectSeats from "./components/UI/SelectSeats.jsx";
import { getAllMovie, getMovieById, getTheatersByMovie } from "./api/user.api.js";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeLayout />,
      errorElement: <ErrorPage />,
      children: [
        { path: "/", element: <HomePage />, loader: getAllMovie },
        { path: "/account", element: <AccountPage /> },
        { path: "/movies", element: <MoviesPage />, loader: getAllMovie },
        { path: "/movies/:id", element: <MoviesBookingPage />, loader: getMovieById },
        { path: "/movies/book-tickets/:id", element: <TicketBookingPage />, loader: getTheatersByMovie, },
        { path: "/movies/book-tickets/:id/:theaterId/:ScreenId", element: <SelectSeats /> },
        { path: "/tickets", element: <TicketPage /> },
        { path: "/tickets", element: <TicketPage /> },
        { path: "/admin", element: <AdminPanel /> },
        { path: "/checkmail", element: <CheckYourEmail /> },
        { path: "/verifiedstatus", element: <VerifiedSuccess /> },
        { path: "/login", element: <LoginPage /> },
        { path: "/register", element: <RegisterPage /> },
        { path: "/emailforotp", element: <EmailforOTP /> },
        { path: "/enterotp", element: <EnterOTP /> },
        { path: "/password-reset", element: <PasswordReset /> },
      ],
    }
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
