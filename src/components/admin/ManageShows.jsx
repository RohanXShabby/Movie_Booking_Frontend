import { useState, useEffect } from 'react';
import axiosInstance from '../../Services/axiosInstance';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const ManageShows = () => {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [movies, setMovies] = useState([]);
    const [theaters, setTheaters] = useState([]);
    const [selectedTheater, setSelectedTheater] = useState('');
    const [screens, setScreens] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [showForm, setShowForm] = useState({
        movieId: '',
        theaterId: '',
        screenId: '',
        date: '',
        time: '',
        format: '',
        seatPrice: [
            { seatType: 'normal', price: 200 },
            { seatType: 'premium', price: 300 }
        ]
    });

    const fetchShows = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/shows');
            setShows(response.data.shows || []);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch shows');
        } finally {
            setLoading(false);
        }
    };

    const fetchMovies = async () => {
        try {
            const response = await axiosInstance.get('/movies');
            setMovies(response.data.movies || []);
        } catch (err) {
            toast.error('Failed to fetch movies');
        }
    };

    const fetchTheaters = async () => {
        try {
            const response = await axiosInstance.get('/theaters');
            setTheaters(response.data.theaters || []);
        } catch (err) {
            toast.error('Failed to fetch theaters');
        }
    };

    const fetchScreens = async (theaterId) => {
        if (!theaterId) {
            setScreens([]);
            return;
        }
        try {
            const theater = theaters.find(t => t._id === theaterId);
            if (theater && theater.screens) {
                setScreens(theater.screens);
            }
        } catch (err) {
            toast.error('Failed to fetch screens');
        }
    };

    useEffect(() => {
        fetchShows();
        fetchMovies();
        fetchTheaters();
    }, []);

    useEffect(() => {
        if (showForm.theaterId) {
            fetchScreens(showForm.theaterId);
        }
    }, [showForm.theaterId]);

    const handleTheaterChange = (theaterId) => {
        setShowForm(prev => ({ ...prev, theaterId, screenId: '' }));
        setSelectedTheater(theaterId);
    }; const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (isEdit) {
                await axiosInstance.put(`/shows/${showForm._id}`, showForm);
                toast.success('Show updated successfully');
            } else {
                await axiosInstance.post('/shows', showForm);
                toast.success('Show added successfully');
            }
            setShowForm({
                movieId: '',
                theaterId: '',
                screenId: '',
                date: '',
                time: '',
                format: '',
                seatPrice: [
                    { seatType: 'normal', price: 200 },
                    { seatType: 'premium', price: 300 }
                ]
            });
            setIsEdit(false); fetchShows();
        } catch (err) {
            toast.error(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'add'} show`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this show?')) {
            try {
                await axiosInstance.delete(`/shows/${id}`);
                toast.success('Show deleted successfully');
                fetchShows();
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to delete show');
            }
        }
    };

    const handleEdit = (show) => {
        setShowForm({
            ...show,
            movieId: show.movieId._id,
            theaterId: show.theaterId._id,
            screenId: show.screenId._id
        });
        setIsEdit(true);
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Shows</h2>
            </div>

            {/* Add/Edit Show Form */}
            <form onSubmit={handleSubmit} className="bg-dark-primary p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold mb-4">{isEdit ? 'Edit Show' : 'Add New Show'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block mb-1">Movie</label>
                        <select
                            value={showForm.movieId}
                            onChange={(e) => setShowForm(prev => ({ ...prev, movieId: e.target.value }))}
                            className="w-full bg-dark-primary p-2 rounded border border-gray-600"
                            required
                        >
                            <option value="">Select Movie</option>
                            {movies.map(movie => (
                                <option key={movie._id} value={movie._id}>{movie.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1">Theater</label>
                        <select
                            value={showForm.theaterId}
                            onChange={(e) => handleTheaterChange(e.target.value)}
                            className="w-full bg-dark-primary p-2 rounded border border-gray-600"
                            required
                        >
                            <option value="">Select Theater</option>
                            {theaters.map(theater => (
                                <option key={theater._id} value={theater._id}>{theater.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1">Screen</label>
                        <select
                            value={showForm.screenId}
                            onChange={(e) => setShowForm(prev => ({ ...prev, screenId: e.target.value }))}
                            className="w-full bg-dark-primary p-2 rounded border border-gray-600"
                            required
                            disabled={!showForm.theaterId}
                        >
                            <option value="">Select Screen</option>
                            {screens.map(screen => (
                                <option key={screen._id} value={screen._id}>{screen.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1">Date</label>
                        <input
                            type="date"
                            value={showForm.date}
                            onChange={(e) => setShowForm(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full bg-dark-primary p-2 rounded border border-gray-600"
                            required
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Time</label>
                        <input
                            type="time"
                            value={showForm.time}
                            onChange={(e) => setShowForm(prev => ({ ...prev, time: e.target.value }))}
                            className="w-full bg-dark-primary p-2 rounded border border-gray-600"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Format</label>
                        <select
                            value={showForm.format}
                            onChange={(e) => setShowForm(prev => ({ ...prev, format: e.target.value }))}
                            className="w-full bg-dark-primary p-2 rounded border border-gray-600"
                            required
                        >
                            <option value="">Select Format</option>
                            <option value="2D">2D</option>
                            <option value="3D">3D</option>
                            <option value="IMAX">IMAX</option>
                            <option value="4DX">4DX</option>
                        </select>
                    </div>
                </div>
                <div className="mt-4">
                    <label className="block mb-2">Seat Pricing</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {showForm.seatPrice.map((price, index) => (
                            <div key={price.seatType} className="flex items-center gap-2">
                                <span className="capitalize w-24">{price.seatType}:</span>
                                <input
                                    type="number"
                                    value={price.price}
                                    onChange={(e) => {
                                        const newPrices = [...showForm.seatPrice];
                                        newPrices[index].price = Number(e.target.value);
                                        setShowForm(prev => ({ ...prev, seatPrice: newPrices }));
                                    }}
                                    className="w-full bg-dark-primary p-2 rounded border border-gray-600"
                                    min="0"
                                    required
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    {isEdit && (
                        <button
                            type="button"
                            onClick={() => {
                                setIsEdit(false);
                                setShowForm({
                                    movieId: '',
                                    theaterId: '',
                                    screenId: '',
                                    date: '',
                                    time: '',
                                    format: '',
                                    seatPrice: [
                                        { seatType: 'normal', price: 200 },
                                        { seatType: 'premium', price: 300 }
                                    ]
                                });
                            }}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                        >
                            Cancel
                        </button>
                    )}                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-dark-accent text-white rounded hover:bg-dark-accent/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                                <span>{isEdit ? 'Updating...' : 'Adding...'}</span>
                            </div>
                        ) : (
                            isEdit ? 'Update Show' : 'Add Show'
                        )}
                    </button>
                </div>
            </form>

            {/* Shows List */}
            <div className="grid grid-cols-1 gap-4">
                {shows.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="mb-4">
                            <FaPlus className="mx-auto text-4xl text-gray-400" />
                        </div>
                        <p className="text-gray-400 text-lg">No shows available.</p>
                    </div>
                ) : (
                    shows.map((show) => (
                        <div key={show._id} className="bg-dark-primary p-4 rounded-lg flex justify-between items-start hover:bg-dark-primary/90 transition">
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{show.movieId.title}</h3>
                                <p className="text-gray-400">
                                    {show.theaterId.name} • {show.screenId.name}
                                </p>
                                <p className="text-gray-400">
                                    {formatDate(show.date)} at {show.time} • {show.format}
                                </p>
                                <div className="mt-2">
                                    {show.seatPrice.map(price => (
                                        <span key={price.seatType} className="text-sm text-gray-400 mr-4">
                                            {price.seatType}: ₹{price.price}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(show)}
                                    className="p-2 text-blue-500 hover:text-blue-600 transition"
                                    title="Edit show"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => handleDelete(show._id)}
                                    className="p-2 text-red-500 hover:text-red-600 transition"
                                    title="Delete show"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManageShows;
