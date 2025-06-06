import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { FaUser, FaTicketAlt, FaHistory, FaCog, FaSignOutAlt } from 'react-icons/fa';
import axiosInstance from '../Services/axiosInstance';
import { useNavigate } from 'react-router-dom';

const AccountPage = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalBookings: 0
    }); useEffect(() => {
        const fetchUserBookings = async () => {
            try {
                console.log('Fetching bookings...'); 
                const response = await axiosInstance.get('/user/bookings');
                console.log('Bookings response:', response.data); 
                setBookings(response.data.bookings);
                setStats({
                    totalBookings: response.data.totalBookings
                });
            } catch (err) {
                console.error('Booking fetch error:', err); 
                setError(err.response?.data?.message || 'Failed to fetch bookings');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchUserBookings();
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const renderTabContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <div className="text-xl text-gray-400">Loading...</div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex justify-center items-center h-64">
                    <div className="text-xl text-red-500">{error}</div>
                </div>
            );
        }

        switch (activeTab) {
            case 'profile':
                return (
                    <div className="space-y-4">
                        <div className="bg-dark-secondary p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-gray-400">Name</label>
                                    <p className="text-lg">{user.name}</p>
                                </div>
                                <div>
                                    <label className="text-gray-400">Email</label>
                                    <p className="text-lg">{user.email}</p>
                                </div>
                                <div>
                                    <label className="text-gray-400">Member Since</label>
                                    <p>{new Date(user.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long'
                                    })}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-dark-secondary p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">Account Statistics</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-dark-primary rounded-lg">
                                    <p className="text-3xl font-bold text-dark-accent">{stats.totalBookings}</p>
                                    <p className="text-gray-400">Total Bookings</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'bookings':
                return (
                    <div className="bg-dark-secondary p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Booking History</h3>
                        <div className="space-y-4">
                            {bookings.length === 0 ? (
                                <div className="text-center text-gray-400 py-8">
                                    No bookings found
                                </div>
                            ) : (
                                bookings.map(booking => (
                                    <div key={booking.id} className="bg-dark-primary p-4 rounded-lg flex justify-between items-center">
                                        <div>
                                            <h4 className="text-lg font-semibold">{booking.movieName}</h4>
                                            <p className="text-gray-400">
                                                {booking.theaterName} • {booking.screenName}
                                            </p>
                                            <p className="text-gray-400">
                                                Date: {booking.date} | Time: {booking.time}
                                            </p>
                                            <p className="text-gray-400">Seats: {booking.seats.join(', ')}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-dark-accent">₹{booking.total}</p>
                                            <span className={`text-sm px-2 py-1 rounded ${booking.isConfirmed
                                                ? 'bg-green-500/20 text-green-500'
                                                : 'bg-yellow-500/20 text-yellow-500'
                                                }`}>
                                                {booking.isConfirmed ? 'Confirmed' : 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div className="bg-dark-secondary p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-400 mb-2">Email Notifications</label>
                                <label className="flex items-center space-x-2">
                                    <input type="checkbox" className="form-checkbox text-dark-accent" />
                                    <span>Receive booking confirmations</span>
                                </label>
                            </div>
                            <div className="pt-4">
                                <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-dark-primary text-dark-text p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
                    <p className="text-gray-400">Manage your account and view your booking history</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <div className="bg-dark-secondary rounded-lg p-4">
                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveTab('profile')} className={`flex items-center space-x-2 w-full p-3 rounded-lg ${activeTab === 'profile'
                                        ? 'bg-dark-accent text-white'
                                        : 'hover:bg-dark-primary'
                                        }`}
                                >
                                    <FaUser />
                                    <span>Profile</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('bookings')}
                                    className={`flex items-center space-x-2 w-full p-3 rounded-lg ${activeTab === 'bookings'
                                        ? 'bg-dark-accent text-white'
                                        : 'hover:bg-dark-primary'
                                        }`}
                                >
                                    <FaTicketAlt />
                                    <span>Bookings</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className={`flex items-center space-x-2 w-full p-3 rounded-lg 
                                    ${activeTab === 'settings'
                                            ? 'bg-dark-accent text-white'
                                            : 'hover:bg-dark-primary'
                                        }`}
                                >
                                    <FaCog />
                                    <span>Settings</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 w-full p-3 rounded-lg text-red-500 hover:bg-dark-primary"
                                >
                                    <FaSignOutAlt />
                                    <span>Logout</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {renderTabContent()}
                    </div>
                </div >
            </div >
        </div >
    );
};

export default AccountPage;
