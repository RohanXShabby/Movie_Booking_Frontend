import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { FaUser, FaTicketAlt, FaHistory, FaCog, FaSignOutAlt } from 'react-icons/fa';
import axiosInstance from '../Services/axiosInstance';
import { useNavigate } from 'react-router-dom';

const AccountPage = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const navigate = useNavigate();
    { user && console.log(user) }

    // Mock data for demonstration (replace with actual API calls)
    const [userDetails] = useState({
        name: "Rohan Bisht",
        email: 'user@example.com',
        joinedDate: 'May 2024',
        totalBookings: 12
    });

    const [bookingHistory] = useState([
        {
            id: 1,
            title: 'Inception',
            date: '2024-05-15',
            time: '18:30',
            seats: ['A1', 'A2'],
            total: '$30'
        },
    ]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const renderTabContent = () => {
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
                                    <p className="text-lg">{userDetails.email}</p>
                                </div>
                                <div>
                                    <label className="text-gray-400">Member Since</label>
                                    <p>{userDetails.joinedDate}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-dark-secondary p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">Account Statistics</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-dark-primary rounded-lg">
                                    <p className="text-3xl font-bold text-dark-accent">{userDetails.totalBookings}</p>
                                    <p className="text-gray-400">Total Bookings</p>
                                </div>
                                {/* Add more statistics */}
                            </div>
                        </div>
                    </div>
                );
            case 'bookings':
                return (
                    <div className="bg-dark-secondary p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Booking History</h3>
                        <div className="space-y-4">
                            {bookingHistory.map(booking => (
                                <div key={booking.id} className="bg-dark-primary p-4 rounded-lg flex justify-between items-center">
                                    <div>
                                        <h4 className="text-lg font-semibold">{booking.movieName}</h4>
                                        <p className="text-gray-400">Date: {booking.date} | Time: {booking.time}</p>
                                        <p className="text-gray-400">Seats: {booking.seats.join(', ')}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-dark-accent">{booking.total}</p>
                                        <button className="text-sm text-dark-accent hover:underline">View Details</button>
                                    </div>
                                </div>
                            ))}
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
