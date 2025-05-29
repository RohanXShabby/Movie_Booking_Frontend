import React, { useState } from 'react';
import axiosInstance from '../Services/axiosInstance';
import { FaFilm, FaUsers, FaChartBar, FaPlus } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';

const ManageMovies = ({ movies }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Manage Movies</h2>
            <div className="grid grid-cols-1 gap-4">
                {movies.map((movie) => (
                    <div key={movie.id} className="bg-dark-primary p-4 rounded-lg flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            {movie.posterUrl && (
                                <img src={movie.posterUrl} alt={movie.title} className="w-16 h-24 object-cover rounded" />
                            )}
                            <div>
                                <h3 className="font-semibold">{movie.title}</h3>
                                <p className="text-sm text-gray-400">{movie.status}</p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded">Edit</button>
                            <button className="px-3 py-1 text-sm bg-red-500 text-white rounded">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Users = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Users Management</h2>
            <p>User management functionality coming soon...</p>
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
    const [activeTab, setActiveTab] = useState('addMovie');
    const [movies, setMovies] = useState([]);
    const [moviePoster, setMoviePoster] = useState(``)
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
    const [success, setSuccess] = useState(false);

    const handleMovieFormChange = (e) => {
        const { name, value } = e.target;
        setMovieForm((prev) => ({
            ...prev,
            [name]: ['cast', 'genre', 'language', 'trailerUrl'].includes(name)
                ? value.split(',')
                : value
        }));
    };

    const handleAddMovie = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);
        try {
            const posterData = new FormData();
            posterData.append('image', moviePoster);
            const posterRes = await axiosInstance.post('/add-poster', posterData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }); console.log(posterRes?.data?.url)
            const updatedMovieForm = {
                ...movieForm,
                posterUrl: posterRes?.data?.url,
            };
            await axiosInstance.post('/add-movie', updatedMovieForm);
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
            setActiveTab('manageMovies')
            setSuccess(true);
            (() => toast.success("Movie Added SuccessFully!", {
                theme: "dark",
                pauseOnHover: false,
            }))()

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add movie');
        } finally {
            setLoading(false);
        }
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
                    {activeTab === 'manageMovies' && <ManageMovies movies={movies} />}
                    {activeTab === 'users' && <Users />}
                    {activeTab === 'reports' && <Reports />}
                    {activeTab === 'addMovie' && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold">Add New Movie</h2>
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
                                        <input type="text" name="director" value={movieForm.director} onChange={handleMovieFormChange} className="w-full bg-dark-primary p-2 rounded border border-gray-600" />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Poster</label>
                                        <input type="file" name="image" onChange={e => setMoviePoster(e.target.files[0])} className="w-full bg-dark-primary p-2 rounded border border-gray-600" />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Trailer URL (comma separated)</label>
                                        <input type="url" name="trailerUrl" onChange={handleMovieFormChange} className="w-full bg-dark-primary p-2 rounded border border-gray-600" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-1">Description</label>
                                    <textarea name="description" value={movieForm.description} onChange={handleMovieFormChange} rows="4" className="w-full bg-dark-primary p-2 rounded border border-gray-600" />
                                </div>

                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                {success && <p className="text-green-500 text-sm">Movie added successfully!</p>}

                                <div className="text-right">
                                    <button type="submit" disabled={loading} className="bg-dark-accent text-white px-6 py-2 rounded hover:bg-dark-accent/80 disabled:opacity-50">
                                        {loading ? (
                                            <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                            </svg>
                                        ) : 'Add Movie'}
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
