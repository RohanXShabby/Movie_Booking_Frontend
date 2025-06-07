import React, { useState, useEffect } from 'react';
import axiosInstance from '../Services/axiosInstance';
import { FaFilm, FaUsers, FaChartBar, FaPlus, FaTheaterMasks, FaCalendarAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import ManageTheaters from '../components/admin/ManageTheaters';
import ManageShows from '../components/admin/ManageShows';

const ManageMovies = ({ movies, handleEdit, fetchMovies, setActiveTab }) => {
    const handleDelete = async (movieId) => {
        if (window.confirm('Are you sure you want to delete this movie?')) {
            try {
                await axiosInstance.delete(`/movies/${movieId}`);
                toast.success('Movie deleted successfully');
                fetchMovies();
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to delete movie');
            }
        }
    };

    if (!movies.length) {
        return (
            <div className="text-center py-8">
                <div className="mb-4">
                    <FaFilm className="mx-auto text-4xl text-gray-400" />
                </div>
                <p className="text-gray-400 text-lg">No movies available.</p>
                <button
                    onClick={() => setActiveTab('addMovie')}
                    className="mt-4 px-4 py-2 bg-dark-accent text-white rounded hover:bg-dark-accent/80 transition"
                >
                    Add Your First Movie
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Movies</h2>
                <button
                    onClick={() => setActiveTab('addMovie')}
                    className="px-4 py-2 bg-dark-accent text-white rounded hover:bg-dark-accent/80 transition flex items-center gap-2"
                >
                    <FaPlus size={14} />
                    Add New Movie
                </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
                {movies.map((movie) => (
                    <div key={movie._id} className="bg-dark-primary p-4 rounded-lg flex justify-between items-start hover:bg-dark-primary/90 transition">
                        <div className="flex items-start space-x-4">
                            {movie.posterUrl && (
                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    className="w-24 h-36 object-cover rounded shadow-md"
                                />
                            )}
                            <div>
                                <h3 className="font-semibold text-lg">{movie.title}</h3>
                                <p className="text-gray-400 text-sm mt-1">{movie.language.join(', ')} | {movie.duration} min</p>
                                <p className="text-gray-400 text-sm">Rating: {movie.rating}</p>
                                <p className="text-gray-500 text-sm mt-2">{movie.genre.join(', ')}</p>
                                <p className="text-gray-500 text-sm">Director: {movie.director}</p>
                                <p className="text-gray-500 text-sm">Release: {new Date(movie.releaseDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(movie)}
                                className="px-4 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center gap-1"
                                title="Edit movie"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(movie._id)}
                                className="px-4 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                title="Delete movie"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/users');
            setUsers(response.data.users || []);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleStatusChange = async (userId, newStatus) => {
        try {
            await axiosInstance.put(`/users/${userId}/status`, { status: newStatus });
            toast.success('User status updated successfully');
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update user status');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await axiosInstance.delete(`/users/${userId}`);
                toast.success('User deleted successfully');
                fetchUsers();
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to delete user');
            }
        }
    };

    const filteredUsers = users.filter(user =>
        statusFilter === 'all' || user.status === statusFilter
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Users Management</h2>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-dark-primary text-dark-text px-4 py-2 rounded border border-gray-600"
                >
                    <option value="all">All Users</option>
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                    <option value="pending">Pending</option>
                </select>
            </div>

            {!users.length ? (
                <div className="text-center py-8">
                    <p className="text-gray-400 text-lg">No users found</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-dark-primary rounded-lg overflow-hidden">
                        <thead className="bg-dark-secondary">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-dark-primary/90">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                                                    <span className="text-lg font-medium text-white">
                                                        {user.name[0].toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-white">{user.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-300">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={user.status}
                                            onChange={(e) => handleStatusChange(user._id, e.target.value)}
                                            className="bg-dark-primary text-sm px-3 py-1 rounded border border-gray-600"
                                        >
                                            <option value="active">Active</option>
                                            <option value="blocked">Blocked</option>
                                            <option value="pending">Pending</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button
                                            onClick={() => handleDeleteUser(user._id)}
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const Reports = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Reports & Analytics</h2>
            <p>Reports and analytics functionality coming soon...</p>
        </div>
    );
};

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('manageMovies');
    const [movies, setMovies] = useState([]);
    const [moviePoster, setMoviePoster] = useState(``);
    const [isEdit, setIsEdit] = useState(false);
    const [movieForm, setMovieForm] = useState({
        title: '',
        genre: [],
        language: [],
        duration: '',
        releaseDate: '',
        description: '',
        posterUrl: '',
        trailerUrl: [],
        rating: '',
        cast: [],
        director: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false); const fetchMovies = async () => {
        try {
            const response = await axiosInstance.get('/movies');
            setMovies(response.data.movies || []);
        } catch (err) {
            toast.error('Failed to fetch movies');
            console.error('Error fetching movies:', err);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const handleMovieFormChange = (e) => {
        const { name, value } = e.target;
        setMovieForm((prev) => ({
            ...prev,
            [name]: ['cast', 'genre', 'language', 'trailerUrl'].includes(name)
                ? value.split(',')
                : value
        }));
    };

    const resetForm = () => {
        setMovieForm({
            title: '',
            genre: [],
            language: [],
            duration: '',
            releaseDate: '',
            description: '',
            posterUrl: '',
            trailerUrl: [],
            rating: '',
            cast: [],
            director: '',
        });
        setMoviePoster('');
        setIsEdit(false);
    };

    const handleAddMovie = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);
        try {
            let posterUrl = movieForm.posterUrl; if (moviePoster) {
                const posterData = new FormData();
                posterData.append('image', moviePoster);
                const posterRes = await axiosInstance.post('/add-poster', posterData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                posterUrl = posterRes?.data?.url;
            }

            const updatedMovieForm = {
                ...movieForm,
                posterUrl,
            };

            if (isEdit) {
                await axiosInstance.put(`/movies/${movieForm._id}`, updatedMovieForm);
                toast.success('Movie updated successfully');
            } else {
                await axiosInstance.post('/add-movie', updatedMovieForm);
                toast.success('Movie added successfully');
            }

            resetForm();
            setActiveTab('manageMovies');
            fetchMovies();

        } catch (err) {
            toast.error(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'add'} movie`);
        } finally {
            setLoading(false);
        }
    };

    const handleEditStart = (movie) => {
        setMovieForm({
            ...movie,
            releaseDate: new Date(movie.releaseDate).toISOString().split('T')[0]
        });
        setIsEdit(true);
        setActiveTab('addMovie');
    };

    return (
        <div className="flex min-h-screen bg-dark-primary text-dark-text">
            <div>
                <ToastContainer position="top-right" />
            </div>
            <aside className="w-64 bg-dark-secondary p-6">
                <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
                <nav className="space-y-4">
                    <button
                        onClick={() => setActiveTab('addMovie')}
                        className={`w-full text-left p-2 rounded flex items-center space-x-2 ${activeTab === 'addMovie'
                            ? 'bg-dark-accent text-white'
                            : 'hover:bg-dark-accent/20'
                            }`}
                    >
                        <FaPlus className="text-sm" />
                        <span>Add Movie</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('manageMovies')}
                        className={`w-full text-left p-2 rounded flex items-center space-x-2 ${activeTab === 'manageMovies'
                            ? 'bg-dark-accent text-white'
                            : 'hover:bg-dark-accent/20'
                            }`}
                    >
                        <FaFilm className="text-sm" />
                        <span>Manage Movies</span>
                    </button>                    <button
                        onClick={() => setActiveTab('theaters')}
                        className={`w-full text-left p-2 rounded flex items-center space-x-2 ${activeTab === 'theaters'
                            ? 'bg-dark-accent text-white'
                            : 'hover:bg-dark-accent/20'
                            }`}
                    >
                        <FaTheaterMasks className="text-sm" />
                        <span>Theaters</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('shows')}
                        className={`w-full text-left p-2 rounded flex items-center space-x-2 ${activeTab === 'shows'
                            ? 'bg-dark-accent text-white'
                            : 'hover:bg-dark-accent/20'
                            }`}
                    >
                        <FaCalendarAlt className="text-sm" />
                        <span>Shows</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`w-full text-left p-2 rounded flex items-center space-x-2 ${activeTab === 'users'
                            ? 'bg-dark-accent text-white'
                            : 'hover:bg-dark-accent/20'
                            }`}
                    >
                        <FaUsers className="text-sm" />
                        <span>Users</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`w-full text-left p-2 rounded flex items-center space-x-2 ${activeTab === 'reports'
                            ? 'bg-dark-accent text-white'
                            : 'hover:bg-dark-accent/20'
                            }`}
                    >
                        <FaChartBar className="text-sm" />
                        <span>Reports</span>
                    </button>
                </nav>
            </aside>
            <main className="flex-1 p-6">
                <div className="max-w-4xl mx-auto bg-dark-secondary rounded-lg p-6 shadow-lg">
                    {activeTab === 'manageMovies' && (
                        <ManageMovies
                            movies={movies}
                            handleEdit={handleEditStart}
                            fetchMovies={fetchMovies}
                            setActiveTab={setActiveTab}
                        />
                    )}                    {activeTab === 'theaters' && <ManageTheaters />}
                    {activeTab === 'shows' && <ManageShows />}
                    {activeTab === 'users' && <Users />}
                    {activeTab === 'reports' && <Reports />}
                    {activeTab === 'addMovie' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">{isEdit ? 'Edit Movie' : 'Add New Movie'}</h2>
                                <button
                                    onClick={() => {
                                        resetForm();
                                        setActiveTab('manageMovies');
                                    }}
                                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                            <form onSubmit={handleAddMovie} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-1">Title</label>
                                        <input type="text" name="title" value={movieForm.title} onChange={handleMovieFormChange} className="w-full bg-dark-primary p-2 rounded border border-gray-600" required />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Genre (comma separated)</label>
                                        <input type="text" name="genre" value={movieForm.genre.join(',')} onChange={handleMovieFormChange} className="w-full bg-dark-primary p-2 rounded border border-gray-600" required />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Language (comma separated)</label>
                                        <input type="text" name="language" value={movieForm.language.join(',')} onChange={handleMovieFormChange} className="w-full bg-dark-primary p-2 rounded border border-gray-600" required />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Duration (minutes)</label>
                                        <input type="number" name="duration" value={movieForm.duration} onChange={handleMovieFormChange} className="w-full bg-dark-primary p-2 rounded border border-gray-600" required />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Release Date</label>
                                        <input type="date" name="releaseDate" value={movieForm.releaseDate} onChange={handleMovieFormChange} className="w-full bg-dark-primary p-2 rounded border border-gray-600 text-dark-text" required />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Rating</label>
                                        <select
                                            name="rating"
                                            value={movieForm.rating}
                                            onChange={handleMovieFormChange}
                                            className="w-full bg-dark-primary p-2 rounded border border-gray-600"
                                            required
                                        >
                                            <option value="">Select Rating</option>
                                            <option value="U">U (Universal)</option>
                                            <option value="UA">UA (Parental Guidance)</option>
                                            <option value="A">A (Adults Only)</option>
                                            <option value="13+">13+</option>
                                            <option value="16+">16+</option>
                                            <option value="18+">18+</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block mb-1">Cast (comma separated)</label>
                                        <input type="text" name="cast" value={movieForm.cast.join(',')} onChange={handleMovieFormChange} className="w-full bg-dark-primary p-2 rounded border border-gray-600" />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Director</label>
                                        <input type="text" name="director" value={movieForm.director} onChange={handleMovieFormChange} className="w-full bg-dark-primary p-2 rounded border border-gray-600" required />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Poster</label>
                                        <input
                                            type="file"
                                            name="image"
                                            onChange={e => setMoviePoster(e.target.files[0])}
                                            className="w-full bg-dark-primary p-2 rounded border border-gray-600"
                                            accept="image/*"
                                            {...(!isEdit && { required: true })}
                                        />
                                        {isEdit && (
                                            <p className="text-sm text-gray-400 mt-1">
                                                Leave empty to keep the current poster
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block mb-1">Trailer URL (comma separated)</label>
                                        <input
                                            type="text"
                                            name="trailerUrl"
                                            value={movieForm.trailerUrl.join(',')}
                                            onChange={handleMovieFormChange}
                                            className="w-full bg-dark-primary p-2 rounded border border-gray-600"
                                            placeholder="https://youtube.com/..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={movieForm.description}
                                        onChange={handleMovieFormChange}
                                        rows="4"
                                        className="w-full bg-dark-primary p-2 rounded border border-gray-600"
                                        required
                                    />
                                </div>

                                {error && <p className="text-red-500 text-sm">{error}</p>}

                                <div className="flex justify-end gap-3">
                                    <button type="submit" disabled={loading} className="bg-dark-accent text-white px-6 py-2 rounded hover:bg-dark-accent/80 disabled:opacity-50">
                                        {loading ? (
                                            <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                            </svg>
                                        ) : isEdit ? 'Update Movie' : 'Add Movie'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;
