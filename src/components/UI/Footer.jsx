import { Link } from 'react-router-dom';

const navlinks = [
    { path: "/", name: 'Home' },
    { path: "/movies", name: 'Movies' },
    { path: "/tickets", name: 'Tickets' },
    { path: "/about", name: 'About Us' },
    { path: "/contact", name: 'Contact' },
    { path: "/faq", name: 'FAQ' },
];

const Footer = () => {
    return (
        <footer className=" py-10 px-primary border-t-2 border-dark-secondary">
            <div className="w-full justify-between grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Brand Info */}
                <div>
                    <h2 className="text-2xl font-bold text-[#F05454] mb-2">MovieSquare</h2>
                    <p className="text-sm">
                        Your ultimate destination for the latest blockbusters and timeless classics. Book tickets, explore films, and enjoy cinema from anywhere.
                    </p>
                </div>

                {/* Navigation Links */}
                <div>
                    <h3 className="text-lg font-semibold mb-2 text-[#F05454]">Quick Links</h3>
                    <ul className="grid grid-cols-2">
                        {navlinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    to={link.path}
                                    className="hover:text-[#F05454] transition-colors duration-200"
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-lg font-semibold mb-2 text-[#F05454]">Contact Us</h3>
                    <p className="text-sm">Email: rohan20ctbisht@gmail.com</p>
                    <p className="text-sm">Phone: +91 7302287997</p>
                    <p className="text-sm">Location: Dehradun, India</p>
                </div>
            </div>

            <div className="border-t border-dark-secondary mt-8 pt-4 text-center text-sm">
                &copy; {new Date().getFullYear()} MovieSquare. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
