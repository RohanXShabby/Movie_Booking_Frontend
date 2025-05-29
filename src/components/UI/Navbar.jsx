import { NavLink } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext.jsx";

const Navbar = () => {
  const { isLoggedIn, user } = useAuth();
  // Defensive: Only treat as admin if isLoggedIn and user?.isAdmin === true
  const isAdmin = Boolean(isLoggedIn && user && user.isAdmin === true);

  const navlinks = [
    { path: "/", name: "Home" },
    { path: "movies", name: "Movies" },
    { path: "tickets", name: "Tickets" },
    ...(isAdmin ? [{ path: "admin", name: "Admin Dashboard" }] : [])
  ];


  return (
    <div className='flex border-b-dark-secondary border-b-2 items-center justify-between px-primary py-2'>
      {/* LOGO */}
      <NavLink to='/' className='text-3xl font-bold'>
        Movie <span className='text-dark-accent'>Square</span>
      </NavLink>

      {/* MENU */}
      <div className='flex gap-primary text-xl font-semibold'>
        {navlinks.map((element, index) => {
          return (
            <NavLink
              className={({ isActive }) =>
                `relative px-4 py-2 rounded-lg transition-all duration-200 ${isActive
                  ? "text-dark-accent after:w-[60%]"
                  : "text-dark-text after:w-0"
                } after:absolute after:left-1/2 after:bottom-0 after:h-[2px] after:bg-dark-accent after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-[60%]`
              }
              key={index}
              to={element.path}
            >
              {element.name}
            </NavLink>
          );
        })}
      </div>

      {/* ACCOUNT SECTION  */}
      <div className='text-xl flex items-center gap-4 font-semibold'>
        {isLoggedIn ? (
          <NavLink to='account' className='flex items-center gap-2 text-xl'>
            <FaUserCircle className="text-2xl" /> {user.name}
          </NavLink>
        ) : (
          <div className='flex gap-4'>
            <NavLink
              className='hover:text-dark-accent transition-all duration-150'
              to='login'
            >
              Log In
            </NavLink>
            <span className='pointer-events-none'>| </span>
            <NavLink
              className='hover:text-dark-accent transition-all duration-150'
              to='register'
            >
              Register
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
