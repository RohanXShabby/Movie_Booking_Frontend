import axiosInstance from "../Services/axiosInstance"; // Assuming this is for future data fetching
import { useLoaderData, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserTie, FaUsers, FaClock, FaStar, FaCalendar, FaFilm, FaBookOpen } from 'react-icons/fa';
const MoviesBookingPage = () => {
    const { id } = useParams();
    const Data = useLoaderData();

    const [moviesDetails, setMoviesDetails] = useState({});

    useEffect(() => {
        // Ensure data is set only once or when ID changes
        if (Data) {
            setMoviesDetails(Data);
        }
    }, [id, Data]);

    // Add a simple loading state or check for data before rendering
    if (!moviesDetails || Object.keys(moviesDetails).length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center text-xl text-dark-text">
                Loading movie details...
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-dark-primary text-dark-text overflow-hidden">
            {/* Background Overlay for a cinematic feel */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm"
                style={{ backgroundImage: `url(${moviesDetails.posterUrl})` }}
            ></div>
            <div className="absolute inset-0 bg-dark-primary opacity-70"></div> {/* Darker overlay using primary color */}

            <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-24 relative z-10 py-8 lg:py-16">
                <div className="flex flex-col lg:flex-row justify-between gap-8 py-8 lg:py-12 items-center lg:items-start">
                    {/* Movie Poster */}
                    <div className="w-full lg:w-[35%] xl:w-[30%] animate-fade-in-up">
                        <div className="relative pb-[150%] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-102 transition-transform duration-500 ease-in-out">
                            <img
                                className="absolute inset-0 w-full h-full object-cover"
                                src={moviesDetails.posterUrl}
                                alt={moviesDetails.title}
                            />
                        </div>
                    </div>

                    {/* Movie Details */}
                    <div className="w-full lg:w-[65%] xl:w-[70%] lg:px-8 xl:px-12 flex flex-col gap-6 text-center lg:text-left">
                        <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold leading-tight animate-slide-in-right bg-gradient-to-r from-dark-accent to-dark-text bg-clip-text text-transparent">
                            {moviesDetails.title}
                        </h1>

                        {/* Languages */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-3 animate-fade-in">
                            {moviesDetails.language?.map((e, i) => (
                                <span
                                    className="border-2 border-dark-accent text-sm md:text-base px-4 py-1.5 rounded-full backdrop-blur-sm bg-dark-secondary/50 text-dark-text hover:bg-dark-accent hover:text-dark-primary transition-all duration-300 ease-in-out cursor-default"
                                    key={i}
                                >
                                    {e}
                                </span>
                            ))}
                        </div>

                        {/* Movie Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center lg:text-left text-lg font-semibold text-dark-text animate-fade-in">
                            <span className="flex flex-col items-center lg:items-start p-2 rounded-lg backdrop-blur-sm bg-dark-secondary/50">
                                <FaClock className="w-5 h-5 mb-1 text-dark-accent" />
                                {moviesDetails.duration} Min
                            </span>
                            <span className="flex flex-col items-center lg:items-start p-2 rounded-lg backdrop-blur-sm bg-dark-secondary/50">
                                <FaStar className="w-5 h-5 mb-1 text-dark-accent" />
                                {moviesDetails.rating}
                            </span>
                            <span className="flex flex-col items-center lg:items-start p-2 rounded-lg backdrop-blur-sm bg-dark-secondary/50">
                                <FaCalendar className="w-5 h-5 mb-1 text-dark-accent" />
                                {moviesDetails.releaseDate}
                            </span>
                            <span className="flex flex-col items-center lg:items-start p-2 rounded-lg backdrop-blur-sm bg-dark-secondary/50 col-span-2 md:col-span-1">
                                <FaFilm className="w-5 h-5 mb-1 text-dark-accent" />
                                {moviesDetails.genre?.map((e, i) => (
                                    <span key={i}>
                                        {e}{i !== moviesDetails.genre.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </span>
                        </div>

                        {/* Director Info */}
                        <div className="flex flex-col items-center lg:items-start gap-2 text-dark-text animate-fade-in-up">
                            <div className="flex items-center gap-2">
                                <FaUserTie className="w-6 h-6 text-dark-accent" />
                                <span className="font-bold text-lg">Director :</span>
                            </div>
                            <span className="bg-dark-secondary/50 text-dark-text px-4 py-1.5 rounded-full text-md backdrop-blur-sm hover:bg-dark-accent/50 transition-colors duration-300 cursor-default">{moviesDetails.director}</span>
                        </div>

                        {/* Cast Info */}
                        <div className="flex flex-col items-center lg:items-start gap-3 animate-fade-in-up">
                            <div className="flex items-center gap-2 text-dark-text">
                                <FaUsers className="w-6 h-6 text-dark-accent" />
                                <span className="font-bold text-lg">Cast :</span>
                            </div>
                            <div className="flex flex-wrap justify-center lg:justify-start gap-2 max-w-full lg:max-w-[90%]">
                                {moviesDetails.cast?.map((actor, i) => (
                                    <span
                                        key={i}
                                        className="bg-dark-secondary/50 text-dark-text px-4 py-1.5 rounded-full text-md backdrop-blur-sm hover:bg-dark-accent/50 transition-colors duration-300 cursor-default"
                                    >
                                        {actor}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="w-full xl:w-[90%] text-sm md:text-base text-dark-text leading-relaxed text-center lg:text-left mt-2 animate-fade-in-up">
                            <div className="flex items-center gap-2">
                                <FaBookOpen className="w-5 h-5 mb-1 text-dark-accent" />
                                <h3 className="font-bold text-lg mb-2 text-dark-text">About Movie :</h3>
                            </div>
                            {moviesDetails.description}
                        </div>

                        {/* Book Ticket Button */}
                        <div className="mt-2 lg:mt-2 text-center lg:text-left animate-bounce-in">
                            <Link
                                to={`/movies/book-tickets/${id}`}
                                className="inline-block font-bold text-lg md:text-xl bg-dark-accent hover:bg-dark-accent/90 text-dark-text px-8 py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-dark-accent focus:ring-opacity-75"
                            >
                                Book Ticket
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MoviesBookingPage;