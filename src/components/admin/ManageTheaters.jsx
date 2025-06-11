import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import axiosInstance from '../../Services/axiosInstance';
import { toast } from 'react-toastify';

const AddTheaterModal = ({ isOpen, onClose, onSave, editingTheater = null, loading = false }) => {
    const [theaterForm, setTheaterForm] = useState({
        name: '',
        city: '',
        address: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [localLoading, setLocalLoading] = useState(false);

    useEffect(() => {
        if (editingTheater) {
            setTheaterForm({
                name: editingTheater.name || '',
                city: editingTheater.city || '',
                address: editingTheater.address || '',
            });
        } else {
            setTheaterForm({
                name: '',
                city: '',
                address: '',
            });
        }
        setFormErrors({});
    }, [editingTheater, isOpen]);

    const validateForm = () => {
        const errors = {};
        if (!theaterForm.name.trim()) errors.name = 'Theater name is required';
        if (!theaterForm.city.trim()) errors.city = 'City is required';
        if (!theaterForm.address.trim()) errors.address = 'Address is required';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }; const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalLoading(true);

        if (!validateForm()) {
            setLocalLoading(false);
            return;
        }

        try {
            await onSave(theaterForm);
            onClose();
        } catch (error) {
            if (error.response?.data?.errors) {
                setFormErrors(error.response.data.errors);
            } else {
                toast.error(error.response?.data?.message || 'Failed to save theater');
            }
        } finally {
            setLocalLoading(false);
        }
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
                            onChange={(e) => {
                                setTheaterForm(prev => ({ ...prev, name: e.target.value }));
                                if (formErrors.name) {
                                    setFormErrors(prev => ({ ...prev, name: '' }));
                                }
                            }}
                            className={`w-full bg-dark-primary p-2 rounded border ${formErrors.name ? 'border-red-500' : 'border-gray-600'
                                }`}
                        />
                        {formErrors.name && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                        )}
                    </div>                    <div>
                        <label className="block mb-1">City</label>
                        <input
                            type="text"
                            value={theaterForm.city}
                            onChange={(e) => {
                                setTheaterForm(prev => ({ ...prev, city: e.target.value }));
                                if (formErrors.city) {
                                    setFormErrors(prev => ({ ...prev, city: '' }));
                                }
                            }}
                            className={`w-full bg-dark-primary p-2 rounded border ${formErrors.city ? 'border-red-500' : 'border-gray-600'
                                }`}
                        />
                        {formErrors.city && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                        )}
                    </div>
                    <div>
                        <label className="block mb-1">Address</label>
                        <textarea
                            value={theaterForm.address}
                            onChange={(e) => {
                                setTheaterForm(prev => ({ ...prev, address: e.target.value }));
                                if (formErrors.address) {
                                    setFormErrors(prev => ({ ...prev, address: '' }));
                                }
                            }}
                            className={`w-full bg-dark-primary p-2 rounded border ${formErrors.address ? 'border-red-500' : 'border-gray-600'
                                }`}
                            rows="3"
                        />
                        {formErrors.address && (
                            <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                        )}
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                            disabled={localLoading || loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={localLoading || loading}
                            className="px-4 py-2 bg-dark-accent text-white rounded hover:bg-dark-accent/80 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {(localLoading || loading) ? (
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

const AddScreenModal = ({ isOpen, onClose, onSave, theaterId, loading = false }) => {
    const [screenForm, setScreenForm] = useState({
        screenName: '',
        rows: 10,
        seatsPerRow: 10,
        seatPricing: {
            normal: 150,
            premium: 200,
            recliner: 300
        },
        rowTypes: Array(10).fill('normal')
    });
    const [formErrors, setFormErrors] = useState({});
    const [localLoading, setLocalLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    // Validate form fields
    const validateForm = () => {
        const errors = {};
        if (!screenForm.screenName.trim()) errors.screenName = 'Screen name is required';
        if (screenForm.rows < 1 || screenForm.rows > 26) errors.rows = 'Rows must be between 1 and 26';
        if (screenForm.seatsPerRow < 1 || screenForm.seatsPerRow > 20) errors.seatsPerRow = 'Seats per row must be between 1 and 20';
        if (screenForm.seatPricing.normal < 0) errors.normalPrice = 'Price cannot be negative';
        if (screenForm.seatPricing.premium < 0) errors.premiumPrice = 'Price cannot be negative';
        if (screenForm.seatPricing.recliner < 0) errors.reclinerPrice = 'Price cannot be negative';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Reset form when modal is closed
    useEffect(() => {
        if (!isOpen) {
            setScreenForm({
                screenName: '',
                rows: 10,
                seatsPerRow: 10,
                seatPricing: {
                    normal: 150,
                    premium: 200,
                    recliner: 300
                },
                rowTypes: Array(10).fill('normal')
            });
            setFormErrors({});
            setShowPreview(false);
        }
    }, [isOpen]);

    // Update row types when number of rows changes
    useEffect(() => {
        setScreenForm(prev => ({
            ...prev,
            rowTypes: Array(prev.rows).fill(prev.rowTypes[0] || 'normal')
        }));
    }, [screenForm.rows]);

    const generateLayout = () => {
        const layout = [];
        for (let i = 0; i < screenForm.rows; i++) {
            const row = [];
            const rowLetter = String.fromCharCode(65 + i);
            const rowType = screenForm.rowTypes[i];
            for (let j = 0; j < screenForm.seatsPerRow; j++) {
                const seatNumber = `${rowLetter}${j + 1}`;
                row.push({
                    seatNumber,
                    seatType: rowType,
                    available: true
                });
            }
            layout.push(row);
        }
        return layout;
    }; const getSeatPreviewStyles = (type) => {
        switch (type) {
            case 'premium':
                return {
                    bg: 'bg-green-500',
                    hover: 'hover:bg-green-600',
                    icon: '🌟'
                };
            case 'recliner':
                return {
                    bg: 'bg-purple-500',
                    hover: 'hover:bg-purple-600',
                    icon: '🛋️'
                };
            default:
                return {
                    bg: 'bg-blue-500',
                    hover: 'hover:bg-blue-600',
                    icon: '💺'
                };
        }
    };

    const setAllRowsType = (type) => {
        setScreenForm(prev => ({
            ...prev,
            rowTypes: Array(prev.rows).fill(type)
        }));
    };

    const renderLayoutPreview = () => {
        return (
            <div className="mt-4 p-4 bg-dark-primary rounded-lg">
                <div className="flex justify-between mb-4">
                    <h4 className="text-sm font-medium">Layout Preview</h4>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setAllRowsType('normal')}
                            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            All Normal
                        </button>
                        <button
                            type="button"
                            onClick={() => setAllRowsType('premium')}
                            className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            All Premium
                        </button>
                        <button
                            type="button"
                            onClick={() => setAllRowsType('recliner')}
                            className="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
                        >
                            All Recliner
                        </button>
                    </div>
                </div>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                    {Array(screenForm.rows).fill(0).map((_, rowIndex) => (
                        <div key={rowIndex} className="flex items-center gap-2">
                            <span className="text-xs w-6">{String.fromCharCode(65 + rowIndex)}</span>
                            <div className="flex gap-1 flex-1">
                                {Array(screenForm.seatsPerRow).fill(0).map((_, seatIndex) => (<div
                                    key={seatIndex}
                                    className={`w-6 h-6 rounded-sm ${getSeatPreviewStyles(screenForm.rowTypes[rowIndex]).bg} ${getSeatPreviewStyles(screenForm.rowTypes[rowIndex]).hover} opacity-90 flex items-center justify-center text-xs transition-colors cursor-default`}
                                    title={`${String.fromCharCode(65 + rowIndex)}${seatIndex + 1} (${screenForm.rowTypes[rowIndex]}) - ₹${screenForm.seatPricing[screenForm.rowTypes[rowIndex]]}`}
                                >
                                    <span className="text-[10px]">{getSeatPreviewStyles(screenForm.rowTypes[rowIndex]).icon}</span>
                                </div>
                                ))}
                            </div>
                            <select
                                value={screenForm.rowTypes[rowIndex]}
                                onChange={(e) => {
                                    const newRowTypes = [...screenForm.rowTypes];
                                    newRowTypes[rowIndex] = e.target.value;
                                    setScreenForm(prev => ({
                                        ...prev,
                                        rowTypes: newRowTypes
                                    }));
                                }}
                                className="bg-dark-secondary text-xs p-1 rounded border border-gray-600"
                            >
                                <option value="normal">Normal (₹{screenForm.seatPricing.normal})</option>
                                <option value="premium">Premium (₹{screenForm.seatPricing.premium})</option>
                                <option value="recliner">Recliner (₹{screenForm.seatPricing.recliner})</option>
                            </select>
                        </div>
                    ))}
                </div>
                <div className="mt-4 text-center">
                    <div className="w-1/2 h-1 bg-gray-500 mx-auto rounded"></div>
                    <span className="text-xs text-gray-400">SCREEN</span>
                </div>
            </div>
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLocalLoading(true);

        if (!theaterId) {
            toast.error('Theater ID is missing');
            setLocalLoading(false);
            return;
        }

        if (!validateForm()) {
            setLocalLoading(false);
            return;
        }

        const layout = generateLayout();
        onSave({
            name: screenForm.screenName,
            layout,
            totalSeats: screenForm.rows * screenForm.seatsPerRow,
            theaterId,
            seatPricing: screenForm.seatPricing
        }).finally(() => {
            setLocalLoading(false);
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-dark-secondary rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Add New Screen</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1">Screen Name</label>
                            <input
                                type="text"
                                value={screenForm.screenName}
                                onChange={(e) => setScreenForm(prev => ({ ...prev, screenName: e.target.value }))}
                                className="w-full bg-dark-primary p-2 rounded border border-gray-600"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1">Rows (A-Z)</label>
                                <input
                                    type="number"
                                    value={screenForm.rows}
                                    onChange={(e) => setScreenForm(prev => ({ ...prev, rows: Math.max(1, Math.min(26, parseInt(e.target.value) || 1)) }))}
                                    className="w-full bg-dark-primary p-2 rounded border border-gray-600"
                                    min="1"
                                    max="26"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Seats/Row</label>
                                <input
                                    type="number"
                                    value={screenForm.seatsPerRow}
                                    onChange={(e) => setScreenForm(prev => ({ ...prev, seatsPerRow: Math.max(1, Math.min(20, parseInt(e.target.value) || 1)) }))}
                                    className="w-full bg-dark-primary p-2 rounded border border-gray-600"
                                    min="1"
                                    max="20"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div>
                        <h3 className="font-medium mb-2">Seat Pricing</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm mb-1">Normal Price (₹)</label>
                                <input
                                    type="number"
                                    value={screenForm.seatPricing.normal}
                                    onChange={(e) => setScreenForm(prev => ({
                                        ...prev,
                                        seatPricing: {
                                            ...prev.seatPricing,
                                            normal: parseInt(e.target.value) || 0
                                        }
                                    }))}
                                    className="w-full bg-dark-primary p-2 rounded border border-gray-600"
                                    min="0"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Premium Price (₹)</label>
                                <input
                                    type="number"
                                    value={screenForm.seatPricing.premium}
                                    onChange={(e) => setScreenForm(prev => ({
                                        ...prev,
                                        seatPricing: {
                                            ...prev.seatPricing,
                                            premium: parseInt(e.target.value) || 0
                                        }
                                    }))}
                                    className="w-full bg-dark-primary p-2 rounded border border-gray-600"
                                    min="0"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Recliner Price (₹)</label>
                                <input
                                    type="number"
                                    value={screenForm.seatPricing.recliner}
                                    onChange={(e) => setScreenForm(prev => ({
                                        ...prev,
                                        seatPricing: {
                                            ...prev.seatPricing,
                                            recliner: parseInt(e.target.value) || 0
                                        }
                                    }))}
                                    className="w-full bg-dark-primary p-2 rounded border border-gray-600"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Layout Configuration */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">Layout Configuration</h3>
                            <button
                                type="button"
                                onClick={() => setShowPreview(!showPreview)}
                                className="text-sm text-dark-accent hover:text-dark-accent/80"
                            >
                                {showPreview ? 'Hide Preview' : 'Show Preview'}
                            </button>
                        </div>

                        {showPreview ? (
                            renderLayoutPreview()
                        ) : (
                            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-2 bg-dark-primary rounded border border-gray-600">
                                {screenForm.rowTypes.map((type, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <span className="text-sm">Row {String.fromCharCode(65 + index)}:</span>
                                        <select
                                            value={type}
                                            onChange={(e) => {
                                                const newRowTypes = [...screenForm.rowTypes];
                                                newRowTypes[index] = e.target.value;
                                                setScreenForm(prev => ({
                                                    ...prev,
                                                    rowTypes: newRowTypes
                                                }));
                                            }}
                                            className="bg-dark-secondary p-1 rounded border border-gray
-600 text-sm flex-1"
                                        >
                                            <option value="normal">Normal (₹{screenForm.seatPricing.normal})</option>
                                            <option value="premium">Premium (₹{screenForm.seatPricing.premium})</option>
                                            <option value="recliner">Recliner (₹{screenForm.seatPricing.recliner})</option>
                                        </select>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
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
            console.log('Sending screen data:', screenData); // Debug log
            const response = await axiosInstance.post(`/theaters/${screenData.theaterId}/screens`, screenData);
            console.log('Screen creation response:', response.data); // Debug log
            toast.success('Screen added successfully');
            await fetchTheaters();
            setIsScreenModalOpen(false);
            setSelectedTheater(null);
        } catch (err) {
            console.error('Error adding screen:', err.response || err); // Debug log
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
            />            <AddScreenModal
                isOpen={isScreenModalOpen}
                onClose={() => {
                    setIsScreenModalOpen(false);
                    setSelectedTheater(null);
                }}
                onSave={handleSaveScreen}
                theaterId={selectedTheater?._id}
                loading={loading}
            />
        </div>
    );
};

export default ManageTheaters;
