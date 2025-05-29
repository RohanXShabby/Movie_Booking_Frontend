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

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeLayout />,
      errorElement: <ErrorPage />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/account", element: <AccountPage /> },
        { path: "/movies", element: <MoviesPage /> },
        { path: "/movies/:id", element: <MoviesBookingPage /> },
        { path: "/movies/book-tickets/:id", element: <TicketBookingPage /> },
        { path: "/movies/book-tickets/:id/:theaterId/:time", element: <SelectSeats /> },
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
    },
    // { path: "/checkmail", element: <CheckYourEmail /> },
    // { path: "/verifiedstatus", element: <VerifiedSuccess /> },
    // { path: "/login", element: <LoginPage /> },
    // { path: "/register", element: <RegisterPage /> },
    // { path: "/emailforotp", element: <EmailforOTP /> },
    // { path: "/enterotp", element: <EnterOTP /> },
    // { path: "/password-reset", element: <PasswordReset /> },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
