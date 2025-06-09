import { NavLink } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext.jsx";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { isLoggedIn, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Defensive: Only treat as admin if isLoggedIn and user?.isAdmin === true
  const isAdmin = Boolean(isLoggedIn && user && user.isAdmin === true);

  const navlinks = [
    { path: "/", name: "Home" },
    { path: "movies", name: "Movies" },
    { path: "tickets", name: "Tickets" },
    ...(isAdmin ? [{ path: "admin", name: "Admin Dashboard" }] : [])
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className='relative border-b-dark-secondary border-b-2'>
      <div className='flex items-center justify-between px-primary py-2'>
        {/* LOGO */}
        <NavLink to='/' className='text-2xl md:text-3xl font-bold'>
          Movie <span className='text-dark-accent'>Square</span>
        </NavLink>

        {/* MOBILE MENU BUTTON */}
        <button
          className='md:hidden text-2xl p-2'
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <HiX /> : <HiMenu />}
        </button>

        {/* DESKTOP MENU */}
        <div className='hidden md:flex gap-primary text-xl font-semibold'>
          {navlinks.map((element, index) => (
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
          ))}
        </div>

        {/* DESKTOP ACCOUNT SECTION */}
        <div className='hidden md:flex text-xl items-center gap-4 font-semibold'>
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
              <span className='pointer-events-none'>|</span>
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

      {/* MOBILE MENU */}
      <div className={`md:hidden fixed inset-0 bg-dark-primary z-50 transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className='flex flex-col h-full p-6'>
          <div className='flex justify-between items-center mb-8'>
            <NavLink to='/' className='text-2xl font-bold' onClick={() => setIsMenuOpen(false)}>
              Movie <span className='text-dark-accent'>Square</span>
            </NavLink>
            <button
              className='text-2xl p-2'
              onClick={toggleMenu}
              aria-label="Close menu"
            >
              <HiX />
            </button>
          </div>

          <div className='flex flex-col gap-4'>
            {navlinks.map((element, index) => (
              <NavLink
                className={({ isActive }) =>
                  `text-xl font-semibold px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? "text-dark-accent bg-dark-secondary/20" : "text-dark-text"
                  }`
                }
                key={index}
                to={element.path}
                onClick={() => setIsMenuOpen(false)}
              >
                {element.name}
              </NavLink>
            ))}
          </div>

          <div className='mt-auto border-t border-dark-secondary pt-6'>
            {isLoggedIn ? (
              <NavLink
                to='account'
                className='flex items-center gap-2 text-xl font-semibold px-4 py-3'
                onClick={() => setIsMenuOpen(false)}
              >
                <FaUserCircle className="text-2xl" /> {user.name}
              </NavLink>
            ) : (
              <div className='flex flex-col gap-4'>
                <NavLink
                  className='text-xl font-semibold px-4 py-3 rounded-lg hover:text-dark-accent transition-all duration-150'
                  to='login'
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log In
                </NavLink>
                <NavLink
                  className='text-xl font-semibold px-4 py-3 rounded-lg hover:text-dark-accent transition-all duration-150'
                  to='register'
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
