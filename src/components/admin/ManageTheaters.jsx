import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import axiosInstance from '../../Services/axiosInstance';
import { toast } from 'react-toastify';

const AddTheaterModal = ({ isOpen, onClose, onSave, editingTheater = null }) => {
    const [theaterForm, setTheaterForm] = useState({
        name: '',
        city: '',
        address: '',
    });

    useEffect(() => {
        if (editingTheater) {
            setTheaterForm({
                name: editingTheater.name,
                city: editingTheater.city,
                address: editingTheater.address,
            });
        }
    }, [editingTheater]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(theaterForm);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-dark-secondary rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">{editingTheater ? 'Edit Theater' : 'Add New Theater'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">Theater Name</label>
                        <input
                            type="text"
                            value={theaterForm.name}
                            onChange={(e) => setTheaterForm(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-dark-primary p-2 rounded border border-gray-600"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1">City</label>
                        <input
                            type="text"
                            value={theaterForm.city}
                            onChange={(e) => setTheaterForm(prev => ({ ...prev, city: e.target.value }))}
                            className="w-full bg-dark-primary p-2 rounded border border-gray-600"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Address</label>
                        <textarea
                            value={theaterForm.address}
                            onChange={(e) => setTheaterForm(prev => ({ ...prev, address: e.target.value }))}
                            className="w-full bg-dark-primary p-2 rounded border border-gray-600"
                            rows="3"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            Cancel
                        </button>                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-dark-accent text-white rounded hover:bg-dark-accent/80 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                                    <span>{editingTheater ? 'Updating...' : 'Adding...'}</span>
                                </div>
                            ) : (
                                editingTheater ? 'Update Theater' : 'Add Theater'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AddScreenModal = ({ isOpen, onClose, onSave, theaterId }) => {
    const [screenForm, setScreenForm] = useState({
        name: '',
        totalSeats: '',
        rows: 10,
        seatsPerRow: 10,
        seatTypes: {
            normal: { price: 150, color: 'gray' },
            premium: { price: 200, color: 'gold' },
            recliner: { price: 300, color: 'purple' }
        }
    });

    const generateLayout = () => {
        const layout = [];
        for (let i = 0; i < screenForm.rows; i++) {
            const row = [];
            const rowLetter = String.fromCharCode(65 + i);
            for (let j = 0; j < screenForm.seatsPerRow; j++) {
                const seatNumber = `${rowLetter}${j + 1}`;
                row.push({
                    seatNumber,
                    seatType: i < 3 ? 'normal' : i < 7 ? 'premium' : 'recliner',
                    available: true
                });
            }
            layout.push(row);
        }
        return layout;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const layout = generateLayout();
        onSave({
            ...screenForm,
            layout,
            totalSeats: screenForm.rows * screenForm.seatsPerRow,
            theaterId
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-dark-secondary rounded-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Add New Screen</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">Screen Name</label>
                        <input
                            type="text"
                            value={screenForm.name}
                            onChange={(e) => setScreenForm(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-dark-primary p-2 rounded border border-gray-600"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1">Number of Rows</label>
                            <input
                                type="number"
                                value={screenForm.rows}
                                onChange={(e) => setScreenForm(prev => ({ ...prev, rows: parseInt(e.target.value) }))}
                                className="w-full bg-dark-primary p-2 rounded border border-gray-600"
                                min="1"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Seats per Row</label>
                            <input
                                type="number"
                                value={screenForm.seatsPerRow}
                                onChange={(e) => setScreenForm(prev => ({ ...prev, seatsPerRow: parseInt(e.target.value) }))}
                                className="w-full bg-dark-primary p-2 rounded border border-gray-600"
                                min="1"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            Cancel
                        </button>                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-dark-accent text-white rounded hover:bg-dark-accent/80 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                                    <span>Adding...</span>
                                </div>
                            ) : 'Add Screen'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ManageTheaters = () => {
    const [theaters, setTheaters] = useState([]);
    const [isTheaterModalOpen, setIsTheaterModalOpen] = useState(false);
    const [isScreenModalOpen, setIsScreenModalOpen] = useState(false);
    const [selectedTheater, setSelectedTheater] = useState(null);
    const [editingTheater, setEditingTheater] = useState(null);
    const [loading, setLoading] = useState(false); const fetchTheaters = async () => {
        try {
            setLoading(true); const response = await axiosInstance.get('/theaters');
            setTheaters(response.data.theaters || []);
        } catch (err) {
            toast.error('Failed to fetch theaters');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTheaters();
    }, []); const handleSaveTheater = async (theaterData) => {
        try {
            setLoading(true);
            if (editingTheater) {
                await axiosInstance.put(`/theaters/${editingTheater._id}`, theaterData);
                toast.success('Theater updated successfully');
            } else {
                await axiosInstance.post('/theaters', theaterData);
                toast.success('Theater added successfully');
            }
            fetchTheaters();
            setIsTheaterModalOpen(false);
            setEditingTheater(null);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save theater');
        }
    }; const handleSaveScreen = async (screenData) => {
        try {
            setLoading(true);
            await axiosInstance.post(`/theaters/${screenData.theaterId}/screens`, screenData);
            toast.success('Screen added successfully');
            fetchTheaters();
            setIsScreenModalOpen(false);
            setSelectedTheater(null);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add screen');
        } finally {
            setLoading(false);
        }
    }; const handleDeleteTheater = async (theaterId) => {
        if (window.confirm('Are you sure you want to delete this theater? This will also delete all associated screens.')) {
            try {
                setLoading(true);
                await axiosInstance.delete(`/theaters/${theaterId}`);
                toast.success('Theater deleted successfully');
                fetchTheaters();
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to delete theater');
            } finally {
                setLoading(false);
            }
        }
    }; const handleDeleteScreen = async (theaterId, screenId) => {
        if (window.confirm('Are you sure you want to delete this screen?')) {
            try {
                setLoading(true);
                await axiosInstance.delete(`/theaters/${theaterId}/screens/${screenId}`);
                toast.success('Screen deleted successfully');
                fetchTheaters();
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to delete screen');
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Manage Theaters</h2>
                <button
                    onClick={() => setIsTheaterModalOpen(true)}
                    className="px-4 py-2 bg-dark-accent text-white rounded hover:bg-dark-accent/80 flex items-center gap-2"
                >
                    <FaPlus size={14} />
                    Add Theater
                </button>
            </div>

            <div className="space-y-6">
                {theaters.map((theater) => (
                    <div key={theater._id} className="bg-dark-primary p-6 rounded-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-semibold">{theater.name}</h3>
                                <p className="text-gray-400 text-sm mt-1">{theater.city}</p>
                                <p className="text-gray-500 text-sm">{theater.address}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setEditingTheater(theater);
                                        setIsTheaterModalOpen(true);
                                    }}
                                    className="p-2 text-blue-500 hover:text-blue-600"
                                    title="Edit theater"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => handleDeleteTheater(theater._id)}
                                    className="p-2 text-red-500 hover:text-red-600"
                                    title="Delete theater"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-medium">Screens</h4>                            <button
                                    onClick={() => {
                                        setSelectedTheater(theater);
                                        setIsScreenModalOpen(true);
                                    }}
                                    className="px-3 py-1 bg-dark-accent text-white rounded text-sm hover:bg-dark-accent/80 flex items-center gap-1"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                                        </div>
                                    ) : (
                                        <>
                                            <FaPlus size={12} />
                                            Add Screen
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {theater.screens?.map((screen) => (
                                    <div key={screen._id} className="bg-dark-secondary p-4 rounded">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h5 className="font-medium">{screen.name}</h5>
                                                <p className="text-gray-400 text-sm">Total Seats: {screen.totalSeats}</p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteScreen(theater._id, screen._id)}
                                                className="text-red-500 hover:text-red-600"
                                                title="Delete screen"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                {!theaters.length && (
                    <div className="text-center py-8">
                        <p className="text-gray-400 text-lg">No theaters available</p>
                        <button
                            onClick={() => setIsTheaterModalOpen(true)}
                            className="mt-4 px-4 py-2 bg-dark-accent text-white rounded hover:bg-dark-accent/80"
                        >
                            Add Your First Theater
                        </button>
                    </div>
                )}
            </div>

            <AddTheaterModal
                isOpen={isTheaterModalOpen}
                onClose={() => {
                    setIsTheaterModalOpen(false);
                    setEditingTheater(null);
                }}
                onSave={handleSaveTheater}
                editingTheater={editingTheater}
            />

            <AddScreenModal
                isOpen={isScreenModalOpen}
                onClose={() => {
                    setIsScreenModalOpen(false);
                    setSelectedTheater(null);
                }}
                onSave={handleSaveScreen}
                theaterId={selectedTheater?._id}
            />
        </div>
    );
};

export default ManageTheaters;
