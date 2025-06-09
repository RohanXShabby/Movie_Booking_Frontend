import { useState } from "react";
import MovieContainer from "../components/UI/MovieContainer";

const HomePage = () => {
    const [activeGenre, setActiveGenre] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const genres = [
        { id: "all", name: "All Movies" },
        { id: "action", name: "Action" },
        { id: "comedy", name: "Comedy" },
        { id: "drama", name: "Drama" },
        { id: "thriller", name: "Thriller" },
        { id: "horror", name: "Horror" }
    ];

    return (
        <div className="min-h-screen bg-dark-primary text-dark-text">
            {/* Search and Filters Header */}
            <div className="sticky top-0 z-20 bg-dark-primary/95 backdrop-blur-sm border-b border-dark-secondary/20 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Search Box */}
                        <div className="w-full md:w-64">
                            <input
                                type="text"
                                placeholder="Search movies..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-dark-secondary/50 border border-dark-secondary/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-dark-accent focus:border-transparent"
                            />
                        </div>
                        {/* Genre Filters */}
                        <div className="flex flex-wrap gap-2">
                            {genres.map((genre) => (
                                <button
                                    key={genre.id}
                                    onClick={() => setActiveGenre(genre.id)}
                                    className={`px-4 py-1 rounded-full text-sm transition-all ${activeGenre === genre.id
                                        ? "bg-dark-accent text-white"
                                        : "bg-dark-secondary/30 hover:bg-dark-accent/20"
                                        }`}
                                >
                                    {genre.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Section */}
            <div className="py-8 px-4 bg-dark-secondary/20">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-6">Featured Movies</h2>
                    <MovieContainer filter={activeGenre} searchQuery={searchQuery} limit={8} />
                </div>
            </div>

            {/* Now Showing Section */}
            <div className="py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-6">Now Showing</h2>
                    <MovieContainer filter="now_showing" searchQuery={searchQuery} limit={4} />
                </div>
            </div>

            {/* Coming Soon Section */}
            <div className="py-8 px-4 bg-dark-secondary/20">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-6">Coming Soon</h2>
                    <MovieContainer filter="coming_soon" searchQuery={searchQuery} limit={4} />
                </div>
            </div>

        </div>
    );
};

export default HomePage;
