import React, { Suspense } from "react";
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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeLayout />,
      errorElement: <ErrorPage />,
      children: [
        { path: "/", element: <HomePage />, loader: getAllMovie },
        { path: "/account", element: <AccountPage /> },
        { path: "/movies/book-tickets/:id/:theaterId/:ScreenId/:showId", element: <SelectSeats /> },
        { path: "/movies/book-tickets/:id", element: <TicketBookingPage />, loader: getTheatersByMovie },
        { path: "/movies/:id", element: <MoviesBookingPage />, loader: getMovieById },
        { path: "/movies", element: <MoviesPage />, loader: getAllMovie },
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
      <Suspense fallback={<div className="w-screen h-screen flex items-center justify-center"><span className="text-dark-accent text-2xl font-bold">Loading...</span></div>}>
        <RouterProvider router={router} />
      </Suspense>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{
          '--toastify-color-success': '#10B981',
          '--toastify-color-error': '#EF4444',
          '--toastify-color-warning': '#F59E0B',
          '--toastify-color-info': '#3B82F6',
          '--toastify-text-color-dark': '#FFFFFF',
          '--toastify-color-dark': '#30475e',
        }}
      />
    </AuthProvider>
  );
}

export default App;
