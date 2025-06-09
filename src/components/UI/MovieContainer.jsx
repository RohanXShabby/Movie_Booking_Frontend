import axiosInstance from "../../Services/axiosInstance";
import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import MovieCard from "./MovieCard";

const MovieContainer = ({ filter = "all", searchQuery = "", limit }) => {
    const Data = useLoaderData();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const filterMovies = () => {
            if (!Data) return [];

            let filteredMovies = [...Data];

            // Apply genre filter
            if (filter !== "all" && filter !== "now_showing" && filter !== "coming_soon") {
                filteredMovies = filteredMovies.filter(movie =>
                    movie.genre.some(g => g.toLowerCase() === filter.toLowerCase())
                );
            }

            // Apply search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                filteredMovies = filteredMovies.filter(movie =>
                    movie.title.toLowerCase().includes(query) ||
                    movie.genre.some(g => g.toLowerCase().includes(query)) ||
                    movie.description.toLowerCase().includes(query)
                );
            }

            // Apply limit
            if (limit && limit > 0) {
                filteredMovies = filteredMovies.slice(0, limit);
            }

            return filteredMovies;
        };

        setLoading(true);
        try {
            const filteredMovies = filterMovies();
            setMovies(filteredMovies);
            setError(null);
        } catch (err) {
            console.error("Error filtering movies:", err);
            setError("Failed to load movies");
        } finally {
            setLoading(false);
        }
    }, [Data, filter, searchQuery, limit]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-8 py-12 px-[5vw]">
                {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="animate-pulse">
                        <div className="bg-dark-secondary rounded-lg h-[400px] mb-4"></div>
                        <div className="h-4 bg-dark-secondary rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-dark-secondary rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500 text-lg">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-6 py-2 bg-dark-accent text-white rounded-lg hover:bg-dark-accent/80 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!movies || movies.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-400 text-lg">
                    {searchQuery
                        ? "No movies found matching your search"
                        : "No movies available in this category"}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-8">
            {movies.map((movie) => (
                <Link to={`/movies/${movie._id}`} key={movie._id}>
                    <MovieCard
                        posterUrl={movie.posterUrl}
                        title={movie.title}
                        description={movie.description}
                        genre={movie.genre}
                        rating={movie.rating}
                    />
                </Link>
            ))}
        </div>
    );
}

export default MovieContainer;
